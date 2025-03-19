using System.Security.Claims;

namespace backend.Models;

[AttributeUsage(AttributeTargets.Method)]
public class ReportAccessAttribute : Attribute
{
    public static bool HasAccessToReport(UserRole role, int violationType)
    {
        // Администратор имеет доступ ко всем отчетам
        if (role == UserRole.Administrator)
            return true;

        // Обычный пользователь имеет доступ только к отчетам с violationType > 2
        return violationType > 2;
    }
} 