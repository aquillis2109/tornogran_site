import { useEffect } from 'react';
import { Layout } from './components/Layout.jsx';
import { RouterProvider, useLocation } from './components/Router.jsx';
import { applySEO, defaultSeo, seoConfig } from './components/SEO.jsx';
import { initializeAnalytics, trackPageView } from './lib/analytics.js';
import { About } from './pages/About.jsx';
import { Contact } from './pages/Contact.jsx';
import { Hardox } from './pages/Hardox.jsx';
import { Home } from './pages/Home.jsx';
import { NotFound } from './pages/NotFound.jsx';
import { Services } from './pages/Services.jsx';
import { SeoServicePage } from './pages/SeoServicePage.jsx';
import { seoServicePages } from './data/seoServicePages.js';

function Routes() {
  const path = useLocation();
  const routes = {
    '/': <Home />,
    '/sobre': <About />,
    '/servicos': <Services />,
    '/hardox': <Hardox />,
    '/contato': <Contact />,
  };

  const servicePage = seoServicePages[path];
  const isKnownRoute = Boolean(routes[path] || servicePage);

  useEffect(() => {
    applySEO(
      path,
      servicePage
        ? {
            title: servicePage.metaTitle,
            description: servicePage.metaDescription,
          }
        : seoConfig[path] || defaultSeo,
    );
    trackPageView(path);
  }, [path, servicePage]);

  if (servicePage) {
    return <SeoServicePage page={servicePage} path={path} />;
  }

  return isKnownRoute ? routes[path] : <NotFound />;
}

export default function App() {
  useEffect(() => {
    initializeAnalytics();
  }, []);

  return (
    <RouterProvider>
      <Layout>
        <Routes />
      </Layout>
    </RouterProvider>
  );
}
