using System.Web.Http;
using Raven.Client;

namespace RavenMDB.Controllers
{

    public abstract class RavenController : ApiController
    {
        public RavenController()
        {
            this.AutoSave = true;
            RavenSession = WebApiApplication.Store.OpenSession();
            Store = WebApiApplication.Store;

        }

        public bool AutoSave { get; set; }

        public IDocumentSession RavenSession { get; protected set; }
        public IDocumentStore Store { get; protected set; }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (RavenSession != null)
                {
                    using (RavenSession)
                    {
                        if (this.AutoSave)
                            RavenSession.SaveChanges();
                        RavenSession.Dispose();
                        RavenSession = null;
                    }
                }
            }

            base.Dispose(disposing);
        }
    }
}