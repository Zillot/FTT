using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Net;

namespace FTT.WebApi.Middleware
{
    public class APIResponse
    {
        public int StatusCode { get; set; }
        public string RequestId { get; set; }
        public object Result { get; set; }

        public APIResponse(int statusCode, object result = null)
        {
            this.StatusCode = statusCode;
            this.Result = result;
        }
    }

    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILoggerFactory logger)
        {
            _next = next;
            _logger = logger.CreateLogger("ExceptionHandlingMiddleware");
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            if (IsSwagger(httpContext) || IsContent(httpContext))
            {
                await _next(httpContext);
            }
            else
            {
                var originalBodyStream = httpContext.Response.Body;

                using (var responseBody = new MemoryStream())
                using (var requestBody = new MemoryStream())
                {
                    httpContext.Response.Body = responseBody;
                    await httpContext.Request.Body.CopyToAsync(requestBody);
                    httpContext.Request.Body = requestBody;
                    requestBody.Seek(0, SeekOrigin.Begin);

                    try
                    {
                        await _next.Invoke(httpContext);
                        var body = await FormatResponse(httpContext.Response);
                        await HandleRequestAsync(httpContext, body, httpContext.Response.StatusCode);

                    }
                    catch (HttpRequestException ex)
                    {
                        await HandleExceptionAsync(httpContext, ex, HttpStatusCode.BadRequest);
                    }
                    catch (FileNotFoundException ex)
                    {
                        await HandleExceptionAsync(httpContext, ex, HttpStatusCode.NotFound);
                    }
                    catch (Exception ex)
                    {
                        await HandleExceptionAsync(httpContext, ex, HttpStatusCode.InternalServerError);
                    }
                    finally
                    {
                        responseBody.Seek(0, SeekOrigin.Begin);
                        httpContext.Response.ContentLength = responseBody.Length;
                        await responseBody.CopyToAsync(originalBodyStream);
                    }
                }
            }
        }

        private bool IsSwagger(HttpContext context)
        {
            return context.Request.Path.StartsWithSegments("/swagger");
        }

        private bool IsContent(HttpContext context)
        {
            return context.Request.Path.StartsWithSegments("/content");
        }

        private async Task<string> FormatResponse(HttpResponse response)
        {
            response.Body.Seek(0, SeekOrigin.Begin);
            var plainBodyText = await new StreamReader(response.Body).ReadToEndAsync();
            response.Body.Seek(0, SeekOrigin.Begin);
            return plainBodyText;
        }

        private async Task HandleExceptionAsync(HttpContext httpContext, Exception ex, HttpStatusCode code)
        {
            if (code == HttpStatusCode.InternalServerError)
            {
                httpContext.Request.EnableBuffering();
                httpContext.Request.Body.Position = 0;

                _logger.LogError(ex, ex.InnerException?.Message ?? ex.Message);
            }
            else
            {
                _logger.LogWarning(ex, ex.InnerException?.Message ?? ex.Message);
            }

            await HandleRequestAsync(httpContext, ex.InnerException?.Message ?? ex.Message, (int)code);
        }

        private Task HandleRequestAsync(HttpContext context, object body, int code)
        {
            context.Response.ContentType = "application/json";
            string jsonString;
            dynamic bodyContent = JsonConvert.DeserializeObject<dynamic>(body.ToString());

            DefaultContractResolver contractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy()
            };

            var apiResponse = new APIResponse(code, bodyContent);
            jsonString = JsonConvert.SerializeObject(apiResponse, new JsonSerializerSettings
            {
                ContractResolver = contractResolver,
                Formatting = Formatting.Indented
            });

            context.Response.StatusCode = code;

            return context.Response.WriteAsync(jsonString);
        }

        private static async Task<string> ReadBodyFromRequest(Stream requestBody)
        {
            using var streamReader = new StreamReader(requestBody, leaveOpen: true);
            var requestBodyString = await streamReader.ReadToEndAsync();
            requestBody.Position = 0;

            return requestBodyString;
        }
    }
}
