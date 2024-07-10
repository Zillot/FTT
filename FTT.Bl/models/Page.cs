namespace FTT.Bl.models
{
    public class Page<T>
    {
        public IEnumerable<T> elements;
        public int page;
        public bool hasMore;
    }
}
