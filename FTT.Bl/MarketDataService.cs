using FTT.Bl.models;
using System.Globalization;

namespace FTT.Bl
{
    public interface IMarketDataService
    {
        Task<Page<MarketLine>> GetMarketListPaged(int size, int page);
    }

    public class MarketDataService: IMarketDataService
    {
        private static IEnumerable<MarketLine> chachedLines = null;

        private const string TIME_FORMAT = "dd/MM/yyyy HH:mm:ss.fff";
        private static char[] DELIMITER = [','];

        public async Task<Page<MarketLine>> GetMarketListPaged(int size, int page)
        {
            if (chachedLines == null)
            {
                chachedLines = await GetMarketListFromCsv("MarketDataTest.csv");
            }

            var fullSize = chachedLines.Count();
            var lines = chachedLines.Skip(size * page).Take(size);

            return new Page<MarketLine>()
            {
                elements = lines,
                hasMore = (size * page + size) < fullSize,
                page = page
            };
        }

        private async Task<IEnumerable<MarketLine>> GetMarketListFromCsv(string nameFileCsv)
        {
            var readFileTask = await File.ReadAllLinesAsync(nameFileCsv);
            IEnumerable<MarketLine> marketList = readFileTask
                .Skip(1)
                .Select(csvLine =>
                {
                    string[] arrLine = csvLine.Split(DELIMITER);
                    MarketLine marketLine = new MarketLine(
                        DateTime.ParseExact(arrLine[0], TIME_FORMAT, 
                        CultureInfo.InvariantCulture),
                        long.Parse(arrLine[1]), 
                        decimal.Parse(arrLine[2]));
                    return marketLine;
                });

            return marketList;
        }
    }
}
