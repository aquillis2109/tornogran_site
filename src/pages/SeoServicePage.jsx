import { CheckCircle2 } from 'lucide-react';
import { Link } from '../components/Router.jsx';
import { contactEmail, contactPhone, geoLatitude, geoLongitude, googleMapsUrl } from '../data/site.js';
import { trackQuoteClick } from '../lib/analytics.js';

const siteUrl = 'https://www.tornogran.com.br';

function serviceSchema(page, path) {
  const url = `${siteUrl}${path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'TORNOGRAN LTDA',
        url: siteUrl,
        logo: `${siteUrl}/assets/tornogran-logo.png`,
        email: contactEmail,
        telephone: contactPhone,
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${siteUrl}/#localbusiness`,
        name: 'TORNOGRAN LTDA',
        url: siteUrl,
        image: `${siteUrl}/assets/hero-fachada-tornogran-optimized.jpg`,
        telephone: contactPhone,
        email: contactEmail,
        hasMap: googleMapsUrl,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: Number(geoLatitude),
          longitude: Number(geoLongitude),
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Rua Projetada H, S/N, Quadra 01, Lote 01 e 02 Polo Empresarial',
          addressLocality: 'Baixo Guandu',
          addressRegion: 'ES',
          postalCode: '29730-000',
          addressCountry: 'BR',
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            opens: '07:00',
            closes: '18:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Friday',
            opens: '07:00',
            closes: '16:00',
          },
        ],
        areaServed: {
          '@type': 'Country',
          name: 'Brasil',
        },
      },
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: page.serviceName,
        serviceType: page.serviceName,
        provider: { '@id': `${siteUrl}/#organization` },
        areaServed: { '@type': 'Country', name: 'Brasil' },
        description: page.metaDescription,
        url,
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: page.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${siteUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Serviços',
            item: `${siteUrl}/servicos`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: page.serviceName,
            item: url,
          },
        ],
      },
    ],
  };
}

export function SeoServicePage({ page, path }) {
  return (
    <>
      <script type="application/ld+json">{JSON.stringify(serviceSchema(page, path))}</script>
      <section className="seo-service-hero">
        <img src={page.image} alt={page.h1} decoding="async" fetchPriority="high" />
        <div className="seo-service-overlay" />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-36 lg:px-8 lg:pt-56">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link path="/">Home</Link>
            <span>/</span>
            <Link path="/servicos">Serviços</Link>
            <span>/</span>
            <strong>{page.serviceName}</strong>
          </nav>
          <p className="eyebrow mt-8">{page.eyebrow}</p>
          <h1>{page.h1}</h1>
          <p>{page.intro}</p>
          <Link path="/contato" className="primary-button mt-8" onClick={() => trackQuoteClick(`seo_${page.slug}_hero`)}>
            Solicitar orçamento
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1fr_0.78fr] lg:px-8">
          <article className="seo-service-content">
            <h2>Atendimento técnico para demandas industriais</h2>
            {page.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <h2>Aplicações e diferenciais</h2>
            <div className="seo-topic-grid">
              {page.topics.map((topic) => (
                <div key={topic} className="seo-topic-card">
                  <CheckCircle2 size={20} />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </article>

          <aside className="seo-service-aside">
            <p className="eyebrow">Orçamento técnico</p>
            <h2>Envie sua necessidade para análise</h2>
            <p>
              Informe aplicação, medidas, material, prazo e anexos técnicos para que a equipe avalie a melhor solução.
            </p>
            <Link path="/contato" className="primary-button" onClick={() => trackQuoteClick(`seo_${page.slug}_aside`)}>
              Falar com a TORNOGRAN
            </Link>
          </aside>
        </div>
      </section>

      <section className="section bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="eyebrow">FAQ</p>
            <h2 className="section-title">Perguntas frequentes sobre {page.serviceName.toLowerCase()}</h2>
          </div>
          <div className="seo-faq-list">
            {page.faq.map((item) => (
              <article key={item.question} className="seo-faq-item">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
