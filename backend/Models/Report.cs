using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Report
{
    public int Id { get; set; }
    // Ф.И.О. гражданина
    [Required(ErrorMessage = "ФИО гражданина обязательно для заполнения")]
    public string CitizenFullName { get; set; } = string.Empty;
    // Номер обращения
    [Required(ErrorMessage = "Номер обращения обязателен для заполнения")]
    public string ApplicationNumber { get; set; } = string.Empty;
    // Дата обращения
    [Required(ErrorMessage = "Дата обращения обязательна для заполнения")]
    public DateTime ApplicationDate { get; set; }
    // Исполнители по обращению
    [Required(ErrorMessage = "Список исполнителей обязателен для заполнения")]
    public string[] Executors { get; set; } = Array.Empty<string>();
    // Ссылка на обращение
    [Required(ErrorMessage = "Ссылка на обращение обязательна для заполнения")]
    public string ApplicationLink { get; set; } = string.Empty;
    // Характер нарушений (1-n)
    [Required(ErrorMessage = "Тип нарушения обязателен для заполнения")]
    [Range(1, int.MaxValue, ErrorMessage = "Тип нарушения должен быть положительным числом")]
    public int ViolationType { get; set; }
    // Результат проверки (редактируемое)
    [Required(ErrorMessage = "Результат проверки обязателен для заполнения")]
    [RegularExpression("^(Выявлено|Не выявлено)$", ErrorMessage = "Результат проверки может быть только 'Выявлено' или 'Не выявлено'")]
    public string InspectionResult { get; set; } = string.Empty;
} 