using System;
using System.Configuration;
using System.Reflection;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Raven.Client;
using Raven.Client.Document;
using Raven.Client.Embedded;
using Raven.Client.Indexes;
using RavenMDB.App_Start;

namespace RavenMDB
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            InitRaven();
        }

        private void InitRaven()
        {
            Store = ConfigurationManager.AppSettings["Environment"]=="Debug"
                ? new EmbeddableDocumentStore { DataDirectory = AppDomain.CurrentDomain.BaseDirectory+@"\App_data\MovieData"}
                : new DocumentStore { ConnectionStringName = "RavenDB" };
            
            Store.Initialize();
            
            new RavenSetup(Store);

            IndexCreation.CreateIndexes(Assembly.GetCallingAssembly(), Store);

        }

        public static IDocumentStore Store;
    }
}