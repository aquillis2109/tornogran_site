import { useRef } from 'react';
import { ArrowLeft, ArrowRight, Award, Factory, ShieldCheck, Wrench } from 'lucide-react';
import { IndustrialCases } from '../components/IndustrialCases.jsx';
import { LocalPresence } from '../components/LocalPresence.jsx';
import { Link } from '../components/Router.jsx';
import { Section } from '../components/Section.jsx';
import { differentials, processSteps, whatsappUrl } from '../data/site.js';
import { trackQuoteClick, trackWhatsAppClick } from '../lib/analytics.js';

const operationImages = [
  { src: '/assets/oficina-geral.png', title: 'Oficina industrial' },
  { src: '/assets/whatsapp-concha-cinza-lateral.jpeg', title: 'Concha fabricada sob demanda' },
  { src: '/assets/whatsapp-concha-cinza-frontal.jpeg', title: 'Componente de grande porte' },
  { src: '/assets/whatsapp-concha-hardox-frontal.jpeg', title: 'Concha Hardox finalizada' },
  { src: '/assets/soldagem-campo.png', title: 'Soldagem em componente pesado' },
  { src: '/assets/concha-fachada.png', title: 'Peças sob demanda' },
  { src: '/assets/instagram-concha-fachada.jpg', title: 'Concha sob demanda' },
  { src: '/assets/instagram-operacao-campo.jpg', title: 'Operação em campo' },
  { src: '/assets/instagram-hardox-soldado.jpg', title: 'Soluções antidesgaste' },
  { src: '/assets/whatsapp-concha-cinza-dentes.jpeg', title: 'Acabamento e dentes reforçados' },
];

const trustMetrics = [
  {
    value: '18+',
    title: 'Anos de experiência',
    text: 'Usinagem e recuperação industrial.',
    icon: Award,
  },
  {
    value: 'Hardox',
    title: 'Soluções antidesgaste',
    text: 'Componentes de alta durabilidade.',
    icon: ShieldCheck,
  },
  {
    value: 'Grande porte',
    title: 'Estrutura industrial',
    text: 'Peças robustas sob demanda.',
    icon: Factory,
  },
  {
    value: 'Sob desenho',
    title: 'Fabricação técnica',
    text: 'Projetos, ajustes e reparos.',
    icon: Wrench,
  },
];

export function Home() {
  const galleryRef = useRef(null);

  const scrollGallery = (direction) => {
    galleryRef.current?.scrollBy({
      left: direction * 420,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <section className="hero">
        <div className="absolute inset-0">
          <img
            src="/assets/hero-fachada-tornogran-optimized.jpg"
            alt="Fachada da Tornogran com estrutura industrial e máquinas pesadas"
            className="h-full w-full object-cover object-center"
            decoding="async"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-[#090f11]/72" />
          <div className="hero-slash" />
          <div className="hero-depth-glow" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090f11]/95 via-[#090f11]/76 to-[#090f11]/42" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090f11]/78 via-transparent to-[#090f11]/34" />
        </div>

        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl items-center justify-center px-5 pb-12 pt-36 text-center lg:px-8 lg:pt-56">
          <div className="hero-copy">
            <p className="hero-eyebrow animate-rise">Especialistas em usinagem pesada</p>
            <h1 className="hero-title animate-rise animation-delay-100">
              Força industrial para operações críticas
            </h1>
            <p className="hero-subtitle animate-rise animation-delay-200">
              Recuperação de componentes, fabricação sob desenho e soluções Hardox para alta exigência.
            </p>

            <div className="hero-trust-bar animate-rise animation-delay-300">
              {trustMetrics.map((item) => (
                <article key={item.title} className="hero-stat">
                  <item.icon size={22} />
                  <strong>{item.value}</strong>
                  <span>{item.title}</span>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>

            <div className="hero-actions animate-rise animation-delay-400">
              <Link path="/contato" className="primary-button hero-primary-button" onClick={() => trackQuoteClick('home_hero')}>
                Solicitar orçamento <ArrowRight size={18} />
              </Link>
              <a
                className="secondary-button hero-secondary-button"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackWhatsAppClick('home_hero')}
              >
                <img
                  src="/assets/whatsapp-logo-transparent.png"
                  alt=""
                  width="20"
                  height="20"
                  className="h-5 w-5 object-contain"
                  loading="lazy"
                  decoding="async"
                />
                Falar com um especialista
              </a>
            </div>
          </div>
        </div>
      </section>

      <Section eyebrow="Diferenciais" title="Precisão, resistência e resposta para ambientes severos">
        <div className="grid gap-4 md:grid-cols-3">
          {differentials.map(({ title, text, icon: Icon }) => (
            <article key={title} className="feature-card">
              <Icon className="text-orange" size={30} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Estrutura"
        title="Serviços executados com estrutura real de oficina"
        text="Imagens de processos e componentes que mostram a atuação da TORNOGRAN em corte, soldagem, recuperação e soluções para desgaste."
      >
        <div className="work-gallery-shell">
          <div className="work-gallery-controls" aria-label="Navegar pela galeria">
            <button type="button" onClick={() => scrollGallery(-1)} aria-label="Ver fotos anteriores">
              <ArrowLeft size={18} />
            </button>
            <button type="button" onClick={() => scrollGallery(1)} aria-label="Ver próximas fotos">
              <ArrowRight size={18} />
            </button>
          </div>
          <div ref={galleryRef} className="work-gallery-viewport">
            <div className="work-gallery" aria-label="Galeria de estrutura industrial em loop">
              {[...operationImages, ...operationImages].map((item, index) => (
                <article key={`${item.src}-${index}`} className="work-gallery-card">
                  <img src={item.src} alt={item.title} loading="lazy" decoding="async" />
                  <span>{item.title}</span>
                </article>
              ))}
            </div>
          </div>
          <div className="work-video-panel">
            <div>
              <p className="eyebrow">Vídeo técnico</p>
              <h3>Registro real de operação e fabricação</h3>
            </div>
            <video controls preload="metadata" playsInline>
              <source src="/assets/whatsapp-video-operacao.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Cases"
        title="Resultados industriais em componentes de alta exigência"
        text="Projetos executados com foco em disponibilidade, resistência ao desgaste e recuperação técnica de ativos para operações pesadas."
        className="case-section"
      >
        <IndustrialCases />
      </Section>

      <Section eyebrow="Processo" title="Do diagnóstico à entrega técnica">
        <div className="grid gap-4 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <article key={step} className="process-card">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{step}</h3>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <LocalPresence />
      </Section>

      <section className="cta-band">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-16 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="eyebrow">Orçamentos técnicos</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black md:text-5xl">
              Conte o problema, envie medidas ou fotos e receba uma orientação objetiva.
            </h2>
          </div>
          <Link path="/contato" className="primary-button shrink-0" onClick={() => trackQuoteClick('home_cta_final')}>
            Iniciar orçamento
          </Link>
        </div>
      </section>
    </>
  );
}
