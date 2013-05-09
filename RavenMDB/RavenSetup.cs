using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using Newtonsoft.Json;
using Raven.Abstractions.Data;
using Raven.Abstractions.Indexing;
using Raven.Client;
using Raven.Client.Indexes;
using Raven.Json.Linq;

namespace RavenMDB
{
    public class RavenSetup
    {
        private IDocumentStore Store { get; set; }
        
        public RavenSetup(IDocumentStore store)
        {
            Store = store;
            if (store.DatabaseCommands.GetStatistics().CountOfDocuments < 10)
                PopulateDataFromFiles();
        }

        private void PopulateDataFromFiles()
        {
            var movies = new List<Movie>();
            var movieParser = new MovieParser();
            movies.AddRange(movieParser.GetMoviesFromJsonFile( "~/movies1.json"));
            SetupFacets(GetFacetsToUse(), Store);
            SaveMovies(movies, Store);
            if(!Store.DatabaseCommands.GetIndexNames(0,10).Contains("ComplexMovieIndex"))
                Store.DatabaseCommands.PutIndex(new ComplexMovieIndex().IndexName,
                                            new ComplexMovieIndex().CreateIndexDefinition());
        }
        private static void SaveMovies(IEnumerable<Movie> movies, IDocumentStore store)
        {
            var movieArray = movies.ToArray();
            using (var session = store.OpenSession())
            {
                foreach (var movie in movieArray)
                {
                    if (movieArray.Count(x => x.Id == movie.Id) == 1)
                        session.Store(movie);
                }
                session.SaveChanges();
            }
        }
        private void SetupFacets(List<Facet> facetsToUse, IDocumentStore store)
        {
            using (var session = store.OpenSession())
            {
                var facetSetupDoc = new FacetSetup { Id = "facets/MovieFacets", Facets = facetsToUse };
                session.Store(facetSetupDoc);
                session.SaveChanges();
            }
        }

        private static List<Facet> GetFacetsToUse()
        {
            var facetsToUse = new List<Facet>()
                                  {
                                      new Facet {Name = "Rated"},
                                      new Facet {Name = "Genres"},
                                      new Facet
                                          {
                                              Name = "Actors",
                                              MaxResults = 10,
                                              TermSortMode = FacetTermSortMode.HitsDesc
                                          },
                                      new Facet {Name = "Directors"},
                                      new Facet<Movie>
                                          {
                                              Name = x => x.Rating,
                                              Ranges =
                                                  {
                                                      x => x.Rating > 0m && x.Rating < 2m,
                                                      x => x.Rating > 2m && x.Rating < 4m,
                                                      x => x.Rating > 4m && x.Rating < 6m,
                                                      x => x.Rating > 6m && x.Rating < 8m,
                                                      x => x.Rating > 8m && x.Rating < 10m,
                                                  }
                                          }
                                  };
            return facetsToUse;
        }
    
    }

    public class MovieParser
    {
        public List<Movie> GetMoviesFromJsonFile(string jsonFileName)
        {
            var fileName = jsonFileName.Replace("~", "");
            var path = AppDomain.CurrentDomain.BaseDirectory+fileName;
            var jsonString = File.ReadAllText(path);
            var jsonList = JsonConvert.DeserializeObject<List<Movie>>(jsonString);
            return jsonList;

        }

        //public void AddJsonDataToRavenDB(string jsonFileName, IDocumentStore store)
        //{
        //    var jsonResult = RavenJToken.ReadFrom(new JsonTextReader(new StreamReader(jsonFileName)));
        //    using (var session = store.OpenSession())
        //    {
        //        foreach (RavenJObject result in (RavenJArray)jsonResult)
        //        {
        //            result["MovieId"] = result["imdb_id"];
        //            result.Remove("imdb_id");
        //            result.RenameFieldNames();

        //            session.Advanced.Defer(
        //                new PutCommandData
        //                {
        //                    Document = result,
        //                    Metadata = new RavenJObject { { "Raven-Entity-Name", "Movies" } },
        //                    Key = "movies/" + result.Value<string>("MovieId")
        //                });
        //        }
        //        session.SaveChanges();

        //    }

        //}
        
        public IEnumerable<Movie> GetMovieDataFromIMDBApi()
        {
            var list = new List<Movie>();
            foreach (var imdbId in ImdbTop250List())
            {
                var url = string.Format(@"http://imdbapi.org/?id={0}&type=json&plot=full&episode=0&lang=en-US&aka=simple&release=simple&business=0&tech=0", imdbId);
                var httpWebRequest = (HttpWebRequest)WebRequest.Create(new Uri(url));
                httpWebRequest.UserAgent = @"Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)";
                httpWebRequest.Method = WebRequestMethods.Http.Get;
                httpWebRequest.Accept = "application/json";
                var response = (HttpWebResponse)httpWebRequest.GetResponse();
                using (var streamReader = new StreamReader(response.GetResponseStream()))
                {
                    var jsonString = streamReader.ReadToEnd();
                    list.Add(JsonConvert.DeserializeObject<Movie>(jsonString));
                }
            }
            return list;
        }

        public void WriteJsonFileToDisk(string path)
        {
            var movies = GetMovieDataFromIMDBApi();
            WriteObjectToJsonFile(movies, path);
        }
        public void WriteObjectToJsonFile(object obj, string path)
        {
            var json = JsonConvert.SerializeObject(obj);
            File.WriteAllText(path, json);
        }

        public static string[] ImdbTop250List()
        {
            return new[] {
                "tt0111161","tt0068646","tt0071562","tt0110912","tt0060196","tt0050083","tt0468569","tt0108052",
                "tt0167260","tt0137523","tt0080684","tt0120737","tt0073486","tt1375666","tt0099685","tt0076759",
                "tt0047478","tt0109830","tt0133093","tt0167261","tt0317248","tt0114369","tt0102926","tt0064116",
                "tt0034583","tt0114814","tt0082971","tt0047396","tt0038650","tt0054215","tt0110413","tt0043014",
                "tt0120586","tt0209144","tt0078788","tt0103064","tt0120815","tt0057012","tt0021749","tt0078748",
                "tt0245429","tt0053125","tt0027977","tt1853728","tt0033467","tt0088763","tt0081505","tt1345836",
                "tt0253474","tt0118799","tt0407887","tt0022100","tt0052357","tt0050825","tt0169547","tt0075314",
                "tt0036775","tt0090605","tt0435761","tt0910970","tt0405094","tt0120689","tt1675434","tt0172495",
                "tt0066921","tt0032553","tt0211915","tt0482571","tt0056172","tt0056592","tt0105236","tt0082096",
                "tt0095765","tt0041959","tt0180093","tt0040897","tt0110357","tt0338013","tt0087843","tt0086190",
                "tt0093058","tt0119488","tt0112573","tt0071315","tt0364569","tt0045152","tt0071853","tt0053291",
                "tt0040522","tt0017136","tt0086879","tt0042876","tt0119698","tt0062622","tt0042192","tt0070735",
                "tt0105695","tt0053604","tt0097576","tt0081398","tt0050212","tt0051201","tt0095327","tt0095016",
                "tt0372784","tt1832382","tt0055630","tt0361748","tt0208092","tt0059578","tt0057115","tt0363163",
                "tt0457430","tt0031679","tt1049413","tt0114709","tt0047296","tt0080678","tt0050976","tt0113277",
                "tt0017925","tt0033870","tt0083658","tt0012349","tt0032976","tt1205489","tt0050986","tt0086250",
                "tt0116282","tt0089881","tt0118715","tt0052311","tt0077416","tt0061512","tt0015864","tt0120735",
                "tt0477348","tt0025316","tt0401792","tt0044079","tt0073195","tt0112641","tt0167404","tt0091763",
                "tt0084787","tt0117951","tt0064115","tt0848228","tt0044706","tt0032138","tt0119217","tt0395169",
                "tt0266697","tt1291584","tt1305806","tt0075686","tt0031381","tt0032551","tt0096283","tt0038787",
                "tt0434409","tt0758758","tt0266543","tt0079470","tt0892769","tt0046912","tt1504320","tt0469494",
                "tt0038355","tt0048424","tt0074958","tt0088247","tt0052618","tt0405159","tt0092005","tt0107048",
                "tt0036868","tt0246578","tt0114746","tt0072890","tt0978762","tt0053198","tt0245712","tt0947798",
                "tt0440963","tt0060827","tt0083987","tt0347149","tt0049406","tt0061722","tt0268978","tt0093779",
                "tt0903624","tt0454876","tt0056801","tt0061184","tt0054997","tt1010048","tt0047528","tt0075148",
                "tt0052561","tt0056218","tt0070047","tt0065214","tt0056217","tt0040746","tt0046359","tt0072684",
                "tt1655442","tt0069281","tt0079944","tt0107207","tt0338564","tt0046250","tt0325980","tt0120382",
                "tt0353969","tt0198781","tt1136608","tt0058461","tt1201607","tt1220719","tt0401383","tt0382932",
                "tt0796366","tt0044081","tt0113247","tt0107290","tt0020629","tt1130884","tt0101414","tt1255953",
                "tt1187043","tt0095953","tt0087544","tt0063522","tt0042546","tt0986264","tt0327056","tt0070511",
                "tt0079522","tt1659337","tt0013442","tt0374546","tt1454029","tt0111495","tt1125849","tt0118694",
                "tt0094226","tt0154420"};
        }
    }
    
    public static class ExtensionMethods
    {
        public static void RenameJSONFieldName(this RavenJObject result, string newName, string oldName)
        {
            result[newName] = result[oldName];
            result.Remove(oldName);
        }

        public static void RenameFieldNames(this RavenJObject result)
        {
            foreach (var key in result.Keys)
            {
                if (key.IndexOf("_", System.StringComparison.Ordinal) <= 0) continue;
                var ti = new CultureInfo("en-US", false).TextInfo;
                var newKey = key.Replace("_", " ");
                newKey = ti.ToTitleCase(newKey).Replace(" ", "");
                result.RenameJSONFieldName(newKey, key);
            }
        }
    }

    public class ComplexMovieIndex : AbstractIndexCreationTask<Movie>
    {
        public ComplexMovieIndex()
        {

            Map = (docs => from movie in docs
                           select new
                           {
                               movie.Id,
                               movie.Title,
                               movie.PlotSimple,
                               movie.Plot,
                               movie.Rating,
                               movie.Rated,
                               movie.Actors,
                               movie.Genres,
                               movie.Directors
                           });
            Index(x => x.Plot, FieldIndexing.Analyzed);
            Index(x => x.PlotSimple, FieldIndexing.Analyzed);
            Index(x => x.Title, FieldIndexing.Analyzed);
            Store(x => x.Plot, FieldStorage.Yes);
            Store(x => x.Title, FieldStorage.Yes);
            TermVector(x => x.Plot, FieldTermVector.WithPositionsAndOffsets);
            Suggestion(x => x.Plot, new SuggestionOptions
            {
                Accuracy = 0.2f,
                Distance = StringDistanceTypes.Levenshtein
            });
        }
    }
}

