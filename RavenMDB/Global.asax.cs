using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Raven.Client;
using Raven.Client.Document;
using Raven.Client.Indexes;
using RavenMDB;
using RavenMDB.App_Start;

namespace RavenDBEval10.WebUI
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

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
            //Store = new EmbeddableDocumentStore { DataDirectory = AppDomain.CurrentDomain.BaseDirectory+@"\App_data\MovieData"};
            Store = new DocumentStore
                {
                    ConnectionStringName = "RavenDB"
                }.Initialize();
            
            new RavenSetup(Store);
            IndexCreation.CreateIndexes(Assembly.GetCallingAssembly(), Store);

        }

        public static IDocumentStore Store;
    }
}