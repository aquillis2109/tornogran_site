import { PageHero, Section } from '../components/Section.jsx';
import { Link } from '../components/Router.jsx';
import { services } from '../data/site.js';
import { seoServicePages } from '../data/seoServicePages.js';

const serviceImages = {
  'usinagem-pesada': '/assets/oficina-cnc-ampla.png',
  'recuperacao-de-componentes': '/assets/recuperacao-cat-antes.png',
  'manutencao-industrial': '/assets/recuperacao-cat-depois.png',
  soldagem: '/assets/soldagem-campo.png',
  'fabricacao-sob-demanda': '/assets/concha-fachada.png',
};

export function Services() {
  return (
    <>
      <PageHero
        eyebrow="Serviços"
        title="Capacidade industrial para fabricação, reparo e manutenção"
        text="Serviços detalhados para componentes de grande porte, peças sob medida e necessidades de manutenção em ambientes industriais de alta exigência."
        backgroundImage="/assets/oficina-cnc-ampla.png"
        imageAlt="Oficina industrial com usinagem pesada e manutenção"
      />
      <Section>
        <div className="seo-link-grid mb-10">
          {Object.entries(seoServicePages).map(([path, page]) => (
            <Link key={path} path={path} className="seo-link-card">
              <span>{page.eyebrow}</span>
              <strong>{page.serviceName}</strong>
            </Link>
          ))}
        </div>
        <div className="grid gap-5">
          {services.map(({ slug, title, intro, details, icon: Icon }) => (
            <article key={slug} id={slug} className="detail-row">
              <div className="detail-icon">
                <Icon size={30} />
              </div>
              <div>
                <h2>{title}</h2>
                <p>{intro}</p>
                <ul>
                  {details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </div>
              <img className="detail-image" src={serviceImages[slug]} alt={title} loading="lazy" decoding="async" />
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
