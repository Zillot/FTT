namespace FTT.Bl.models
{
    public class MarketLine
    {
        public DateTime Time;
        public long Quantity;
        public decimal Price;

        public MarketLine(DateTime time, long quantity, decimal price)
        {
            Time = time;
            Quantity = quantity;
            Price = price;
        }
    }
}
