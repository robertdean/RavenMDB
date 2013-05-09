using Newtonsoft.Json;

namespace RavenMDB
{
    public class Movie 
    {
        [JsonProperty("imdb_id")]
        public string Id { get; set; }
        [JsonProperty("also_known_as")]
        public string[] AlsoKnownAs { get; set; }
        public string[] Language { get; set; }
        [JsonProperty("filming_locations")]
        public string FilmingLocations { get; set; }
        public string[] Actors { get; set; }
        public string[] Genres { get; set; }
        public string[] Country { get; set; }
        public string[] Directors { get; set; }
        public string[] Writers { get; set; }
        public string[] Runtime { get; set; }
        public string Title { get; set; }
        [JsonProperty("plot_simple")]
        public string PlotSimple { get; set; }
        public string Plot { get; set; }
        [JsonProperty("release_date")]
        public int ReleaseDate { get; set; }
        public decimal Rating { get; set; }
        public string Rated { get; set; }
        public string[] HighLights { get; set; }
    }
}