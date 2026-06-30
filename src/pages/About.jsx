import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { resolveImage, useAdminContent } from '../lib/useAdminContent.js';

const aboutItems = [
  {
    title: 'História',
    text: 'Somos uma empresa que oferece soluções para clientes das áreas de mineração e máquinas pesadas, além de serviços de usinagem, torno e solda em geral. A Tornogran surgiu a partir de uma demanda crescente do mercado de mineração do Norte do Estado do Espírito Santo, que buscava uma empresa capaz de atender às suas necessidades. Com mais de 18 anos de mercado, adquirimos vasta experiência no setor de usinagem e tornearia, evoluindo e ampliando nosso catálogo de produtos e serviços.',
  },
  {
    title: 'Missão',
    text: 'Por meio de produtos e serviços de qualidade, atendimento personalizado e agilidade nas entregas, a Tornogran se tornou referência no setor de peças e serviços, especialmente para o mercado de mineração. Também atende outros segmentos, como usinas hidrelétricas, mecânicas e indústrias em geral.',
  },
  {
    title: 'Visão',
    text: 'Tornar-se referência na Região Sudeste do Brasil em produtos para mineração e oferecer serviços de excelência nas áreas de usinagem, torno e solda em geral.',
  },
  {
    title: 'Valores',
    text: 'Nossos valores são o que direcionam nosso comportamento com nossos colaboradores, nossos parceiros e clientes. Por isso prezamos por: respeitar o meio ambiente; prezar pelo bem-estar e capacitação dos colaboradores; paixão pelo que fazemos; promover o desenvolvimento social; pioneirismo em tecnologia; melhoria contínua; conduta ética; inovação constante.',
  },
];

export function About() {
  const [openIndex, setOpenIndex] = useState(0);
  const content = useAdminContent();
  const mainImage = resolveImage(content.aboutMainImage, {
    src: '/assets/fachada-tornogran.png',
    alt: 'Estrutura industrial da Tornogran',
  });

  return (
    <>
      <section className="about-showcase about-showcase-first">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-8">
          <div>
            <div className="mb-8 flex gap-2">
              <span className="h-1.5 w-8 skew-x-[-28deg] bg-[#f6c400]" />
              <span className="h-1.5 w-8 skew-x-[-28deg] bg-[#f6c400]" />
            </div>
            <p className="eyebrow">Sobre nós</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-tight text-[#34393b] md:text-5xl">
              {content.aboutTitle || 'Principais pontos sobre a empresa'}
            </h2>
            <p className="mt-6 max-w-3xl leading-8 text-[#6c7478]">
              Nossos princípios fundamentais formam a base da maneira como atuamos em conjunto para atender aos nossos
              clientes.
            </p>

            <div className="mt-8 border-y border-[#dde2e4]">
              {aboutItems.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <article key={item.title} className="border-b border-[#dde2e4] last:border-b-0">
                    <button
                      type="button"
                      className="flex w-full items-center gap-5 py-6 text-left transition hover:text-orange"
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center text-[#8a9296]">
                        <MoreHorizontal size={26} />
                      </span>
                      <span className="text-lg font-semibold text-[#6c7478]">{item.title}</span>
                    </button>
                    <div className={`about-answer ${isOpen ? 'about-answer-open' : ''}`}>
                      <p>{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-5 -top-5 h-28 w-28 bg-[#f6c400]" />
            <img
              src={mainImage.src}
              alt={mainImage.alt || 'Estrutura industrial da Tornogran'}
              className="relative z-10 h-[520px] w-full object-cover shadow-[0_28px_70px_rgba(23,37,41,0.22)]"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute -bottom-5 -right-5 z-20 bg-[#172529] px-6 py-5 text-white shadow-xl">
              <strong className="block text-3xl font-black text-[#f6c400]">18+</strong>
              <span className="text-xs font-bold uppercase tracking-[0.18em]">anos de mercado</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
