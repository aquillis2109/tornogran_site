import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from '../components/Router.jsx';
import { hardoxApplications } from '../data/site.js';
import { trackQuoteClick } from '../lib/analytics.js';

const benefits = [
  'Maior vida útil em zonas de desgaste',
  'Redução de paradas para troca de componentes',
  'Aplicação sob medida para mineração e máquinas pesadas',
  'Suporte técnico para escolha de material, espessura e solução',
];

const hardoxParts = [
  { src: '/assets/concha-fachada.png', title: 'Concha sob demanda' },
  { src: '/assets/hardox-concha-02.jpg', title: 'Componente antidesgaste' },
  { src: '/assets/instagram-concha-carregadeira.jpg', title: 'Concha para grande porte' },
  { src: '/assets/instagram-hardox-soldado.jpg', title: 'Aplicação antidesgaste' },
];

const hardoxUrl = 'https://www.hardoxwearparts.com/pt-br/';

export function Hardox() {
  return (
    <>
      <section className="hardox-hero">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1fr_0.82fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-white/75">Hardox Wearparts</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-tight text-white md:text-6xl">
              Soluções antidesgaste para operações de mineração
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/82">
              A TORNOGRAN participa do programa Hardox Wearparts, oferecendo soluções em aço antidesgaste para
              componentes expostos a abrasão, impacto e ciclos severos de operação.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link path="/contato" className="hardox-button" onClick={() => trackQuoteClick('hardox_hero')}>
                Solicitar solução Hardox
              </Link>
              <Link path="/servicos" className="hardox-button-outline">
                Ver serviços industriais
              </Link>
            </div>
          </div>

          <a className="hardox-image-panel" href={hardoxUrl} target="_blank" rel="noreferrer" aria-label="Abrir site Hardox Wearparts">
            <img
              className="hardox-plate-image"
              src="/assets/chapas-hardox.jpg"
              alt="Chapas de aço Hardox"
              decoding="async"
              fetchPriority="high"
            />
            <div className="hardox-image-overlay" />
            <img
              className="hardox-overlay-logo"
              src="/assets/hardox-wearparts-logo.webp"
              alt="Hardox Wearparts"
              width="1024"
              height="310"
              decoding="async"
            />
            <p>
              Peças, revestimentos e componentes desenvolvidos para ambientes com alto desgaste, especialmente no
              transporte, processamento e movimentação de minério.
            </p>
          </a>
        </div>
      </section>

      <section className="hardox-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="eyebrow">Aplicações</p>
            <h2 className="section-title">Onde o Hardox faz diferença</h2>
            <p className="section-text">
              Em mineração, transporte e processamento de materiais, o aço antidesgaste ajuda a elevar a vida útil de
              proteções, revestimentos e peças expostas ao atrito.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {hardoxApplications.map((item) => (
              <div key={item} className="hardox-check">
                <CheckCircle2 size={22} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {hardoxParts.map((item) => (
              <article key={item.src} className="hardox-part-card">
                <img src={item.src} alt={item.title} loading="lazy" decoding="async" />
                <span>{item.title}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hardox-benefits">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Benefícios</p>
              <h2 className="section-title text-white">Resistência com estratégia de manutenção</h2>
            </div>
            <a className="hardox-site-link" href={hardoxUrl} target="_blank" rel="noreferrer">
              <ShieldCheck size={22} />
              Site Hardox Wearparts
            </a>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item) => (
              <article key={item} className="hardox-benefit-card">
                <h3>{item}</h3>
                <p>A escolha correta do material aumenta a confiabilidade do conjunto em operação.</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
