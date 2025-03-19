using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace backend.Attributes
{
    [AttributeUsage(AttributeTargets.Method)]
    public class AdminOnlyViolationAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;
            if (!user.IsInRole("Administrator"))
            {
                context.Result = new ForbidResult();
            }
        }
    }
} 