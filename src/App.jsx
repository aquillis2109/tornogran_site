import { useEffect } from 'react';
import { Layout } from './components/Layout.jsx';
import { RouterProvider, useLocation } from './components/Router.jsx';
import { applySEO, defaultSeo, seoConfig } from './components/SEO.jsx';
import { initializeAnalytics, trackPageView } from './lib/analytics.js';
import { About } from './pages/About.jsx';
import { Cases } from './pages/Cases.jsx';
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
    '/cases': <Cases />,
  };

  const servicePage = seoServicePages[path];

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

  if (routes[path]) {
    return routes[path];
  }

  if (servicePage) {
    return <SeoServicePage page={servicePage} path={path} />;
  }

  return <NotFound />;
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
