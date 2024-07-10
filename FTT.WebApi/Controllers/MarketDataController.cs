using FTT.Bl;
using FTT.Bl.models;
using Microsoft.AspNetCore.Mvc;

namespace FTT.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MarketDataController : ControllerBase
    {
        private readonly IMarketDataService _marketDataService;

        public MarketDataController(IMarketDataService marketDataService)
        {
            _marketDataService = marketDataService;
        }

        [HttpGet]
        public async Task<Page<MarketLine>> getMarketLines([FromQuery] int size, [FromQuery] int page)
        {
            return await _marketDataService.GetMarketListPaged(size, page);
        }
    }
}
