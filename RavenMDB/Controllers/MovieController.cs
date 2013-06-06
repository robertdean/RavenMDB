using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web.Http;
using Raven.Abstractions.Data;
using Raven.Client;

namespace RavenMDB.Controllers
{
    public class MovieController : RavenController
    {
        // GET /api/values
        public Movie Get(string id)
        {
            this.AutoSave = false;
            return RavenSession.Load<Movie>(id);
        }

        // GET /api/values
        public SearchResult Post([FromBody] SearchRequest request )
        {
            this.AutoSave = false;
            request.currentPage = request.currentPage == 0 ? 1 : request.currentPage;
            request.pageSize = request.pageSize == 0 ? 10 : request.pageSize;

            var httpRequest = Request.Content;
            FieldHighlightings fieldHighlightings;
            var query = RavenSession.Advanced.LuceneQuery<Movie>("ComplexMovieIndex")
                .Highlight("Plot", 128, 2, out fieldHighlightings);

            if (string.IsNullOrEmpty(request.q)) request.q = "*";

            var results = query.Search("Plot", request.q);

            foreach (var facet in request.facets)
            {
                
                query = query
                    .AndAlso()
                    .Where(
                        facet.facetFilterValue.Contains(" ") && !facet.facetFilterValue.StartsWith("[Dx")
                        ? string.Format("{0}:\"{1}\"", facet.facetName, facet.facetFilterValue)
                        : string.Format("{0}:{1}", facet.facetName, facet.facetFilterValue));
            }

            var facets = query.ToFacets("facets/MovieFacets");

            var suggestionQuery = Store.DatabaseCommands
                .Suggest("ComplexMovieIndex", new SuggestionQuery{
                    Field = "Plot",
                    Term = request.q
                });

            RavenQueryStatistics stats;
            query.Statistics(out stats);

            return new SearchResult
                       {
                           TitlesFound = results.Select(x=>new TitleFound
                                                            {
                                                                Id=x.Id,
                                                                Score=RavenSession.Advanced.GetMetadataFor(x).Value<double>("Temp-Index-Score"),
                                                                Title=x.Title,
                                                                PlotSimple = x.PlotSimple,
                                                                Highlights = fieldHighlightings.GetFragments(x.Id),
                                                                Directors = x.Directors,
                                                                Rated = x.Rated
                                                            })
                                                            .Skip((request.currentPage-1) * request.pageSize)
                                                            .Take(request.pageSize).ToList(),
                           FacetedResults = facets.Results.Select(x=>new { Name=x.Key, Values = x.Value }),
                           FacetedFilterApplied = request.facets,
                           Suggestions = suggestionQuery.Suggestions,
                           PageSize = request.pageSize,
                           Stats = stats,
                           BuildId = ConfigurationManager.AppSettings["appharbor.commit_id"]
                       };

        }    
    }

    public class SearchRequest
    {
        public string q { get; set; }
        public List<FacetedFilter> facets { get; set; }
        public int currentPage { get; set; }
        public int pageSize { get; set; }
    }

    public class FacetedFilter
    {
        public string facetName { get; set; }
        public string facetFilterValue { get; set; }
    }

    public class TitleFound
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string PlotSimple { get; set; }
        public double Score { get; set; }
        public string[] Highlights { get; set; }
        public string[] Directors { get; set; }
        public string Rated { get; set; }
    }

    public class SearchResult
    {
        public RavenQueryStatistics Stats { get; set; }
        public object FacetedResults { get; set; }
        public List<FacetedFilter> FacetedFilterApplied { get; set; }
        public IEnumerable<TitleFound> TitlesFound { get; set; }
        public string[] Suggestions { get; set; }
        public int PageSize { get; set; }
        public string BuildId { get; set; }
    }
}