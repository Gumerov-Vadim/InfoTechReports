using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System.Text;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private static readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);

    public ReportsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/reports
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Report>>> GetReports()
    {
        return await _context.Reports.ToListAsync();
    }

    // GET: api/reports/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Report>> GetReport(int id)
    {
        var report = await _context.Reports.FindAsync(id);
        if (report == null)
        {
            return NotFound();
        }
        return report;
    }

    // PUT: api/reports/5/inspection-result
    [HttpPut("{id}/inspection-result")]
    public async Task<IActionResult> UpdateInspectionResult(int id, [FromBody] string newResult)
    {
        if (newResult != "Выявлено" && newResult != "Не выявлено")
        {
            return BadRequest("Недопустимое значение результата проверки");
        }

        try
        {
            await _semaphore.WaitAsync(); // Обеспечиваем потокобезопасность

            var report = await _context.Reports.FindAsync(id);
            if (report == null)
            {
                return NotFound();
            }

            report.InspectionResult = newResult;
            await _context.SaveChangesAsync();

            return Ok(report);
        }
        finally
        {
            _semaphore.Release();
        }
    }

    [HttpPost]
    public async Task<ActionResult<Report>> CreateReport(Report report)
    {
        if (report.InspectionResult != "Выявлено" && report.InspectionResult != "Не выявлено")
        {
            return BadRequest("Недопустимое значение результата проверки. Допустимые значения: 'Выявлено' или 'Не выявлено'");
        }

        _context.Reports.Add(report);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetReport), new { id = report.Id }, report);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var report = await _context.Reports.FindAsync(id);
        if (report == null)
            return NotFound();

        _context.Reports.Remove(report);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpGet("generate-report")]
    public async Task<IActionResult> GenerateReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        // Преобразуем даты в UTC
        var utcStartDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc);
        var utcEndDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc);

        // Получаем данные за указанный период
        var reports = await _context.Reports
            .Where(r => r.ApplicationDate >= utcStartDate && r.ApplicationDate <= utcEndDate)
            .ToListAsync();

        // Группируем данные по типу нарушения и результату проверки
        var reportData = reports
            .GroupBy(r => r.ViolationType)
            .Select(g => new
            {
                ViolationType = g.Key,
                Found = g.Count(r => r.InspectionResult == "Выявлено"),
                NotFound = g.Count(r => r.InspectionResult == "Не выявлено")
            })
            .OrderBy(x => x.ViolationType)
            .ToList();

        // Создаем документ Word
        var memoryStream = new MemoryStream();
        using (var document = WordprocessingDocument.Create(memoryStream, WordprocessingDocumentType.Document))
        {
            var mainPart = document.AddMainDocumentPart();
            mainPart.Document = new Document();
            var body = mainPart.Document.AppendChild(new Body());

            // Добавляем заголовок
            var title = body.AppendChild(new Paragraph());
            title.AppendChild(new Run(new Text($"Сформированный отчет по нарушениям с {startDate:dd.MM.yyyy} по {endDate:dd.MM.yyyy}")));
            title.ParagraphProperties = new ParagraphProperties(new Justification() { Val = JustificationValues.Center });
            body.AppendChild(new Paragraph(new Run(new Text(""))));

            // Создаем таблицу
            var table = new Table();
            var tableProperties = new TableProperties(
                new TableBorders(
                    new TopBorder() { Val = new EnumValue<BorderValues>(BorderValues.Single), Size = 1 },
                    new BottomBorder() { Val = new EnumValue<BorderValues>(BorderValues.Single), Size = 1 },
                    new LeftBorder() { Val = new EnumValue<BorderValues>(BorderValues.Single), Size = 1 },
                    new RightBorder() { Val = new EnumValue<BorderValues>(BorderValues.Single), Size = 1 },
                    new InsideHorizontalBorder() { Val = new EnumValue<BorderValues>(BorderValues.Single), Size = 1 },
                    new InsideVerticalBorder() { Val = new EnumValue<BorderValues>(BorderValues.Single), Size = 1 }
                )
            );
            table.AppendChild(tableProperties);

            // Добавляем заголовки таблицы
            var headerRow = new TableRow();
            headerRow.AppendChild(new TableCell(new Paragraph(new Run(new Text("")))));
            headerRow.AppendChild(new TableCell(new Paragraph(new Run(new Text("Выявлено")))));
            headerRow.AppendChild(new TableCell(new Paragraph(new Run(new Text("Не выявлено")))));
            table.AppendChild(headerRow);

            // Добавляем данные
            foreach (var row in reportData)
            {
                var dataRow = new TableRow();
                dataRow.AppendChild(new TableCell(new Paragraph(new Run(new Text(row.ViolationType.ToString())))));
                dataRow.AppendChild(new TableCell(new Paragraph(new Run(new Text(row.Found.ToString())))));
                dataRow.AppendChild(new TableCell(new Paragraph(new Run(new Text(row.NotFound.ToString())))));
                table.AppendChild(dataRow);
            }

            body.AppendChild(table);

            // Добавляем итоги
            var totalFound = reportData.Sum(r => r.Found);
            var totalNotFound = reportData.Sum(r => r.NotFound);
            body.AppendChild(new Paragraph(new Run(new Text($"Всего выявлено: {totalFound}"))));
            body.AppendChild(new Paragraph(new Run(new Text($"Всего не выявлено: {totalNotFound}"))));
        }

        memoryStream.Position = 0;
        return File(memoryStream, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
            $"Отчет_{startDate:yyyyMMdd}_{endDate:yyyyMMdd}.docx");
    }
} 