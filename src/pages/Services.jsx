import { PageHero, Section } from '../components/Section.jsx';
import { Link } from '../components/Router.jsx';
import { services } from '../data/site.js';
import { seoServicePages } from '../data/seoServicePages.js';
import { useEffect, useMemo, useState } from 'react';
import { getServices, listenAdminData, normalizeImageValue } from '../lib/adminStore.js';

const serviceImages = {
  'usinagem-pesada': '/assets/oficina-cnc-ampla.png',
  'recuperacao-de-componentes': '/assets/recuperacao-cat-antes.png',
  'manutencao-industrial': '/assets/recuperacao-cat-depois.png',
  soldagem: '/assets/soldagem-campo.png',
  'fabricacao-sob-demanda': '/assets/concha-fachada.png',
};

const serviceDetailLinks = {
  'usinagem-pesada': '/usinagem-pesada',
  'recuperacao-de-componentes': '/recuperacao-industrial',
  'manutencao-industrial': '/manutencao-industrial',
  soldagem: '/caldeiraria-industrial',
  'fabricacao-sob-demanda': '/fabricacao-sob-desenho',
};

export function Services() {
  const [adminServices, setAdminServices] = useState(getServices);
  const serviceConfig = useMemo(() => {
    return Object.fromEntries(adminServices.map((service) => [service.slug, service]));
  }, [adminServices]);

  useEffect(() => {
    return listenAdminData(() => setAdminServices(getServices()));
  }, []);

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
              <strong>{page.cardText}</strong>
            </Link>
          ))}
        </div>
        <div className="grid gap-5">
          {services.map(({ slug, title, intro, details, icon: Icon }) => {
            const config = serviceConfig[slug];
            const mainImage = normalizeImageValue(config?.image) || { src: serviceImages[slug], alt: title };
            const gallery = (config?.gallery || []).map(normalizeImageValue).filter(Boolean);

            return (
              <Link key={slug} id={slug} path={serviceDetailLinks[slug]} className="detail-row detail-row-link">
                <div className="detail-icon">
                  <Icon size={30} />
                </div>
                <div>
                  <h2>{config?.name || title}</h2>
                  <p>{config?.description || intro}</p>
                  <ul>
                    {details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                  {gallery.length > 0 && (
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      {gallery.slice(0, 3).map((image) => (
                        <img key={image.src} className="h-20 rounded-xl object-cover" src={image.src} alt={image.alt || title} loading="lazy" decoding="async" />
                      ))}
                    </div>
                  )}
                </div>
                <img className="detail-image" src={mainImage.src} alt={mainImage.alt || title} loading="lazy" decoding="async" />
              </Link>
            );
          })}
        </div>
      </Section>
    </>
  );
}
