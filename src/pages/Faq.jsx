import { HelpCircle } from 'lucide-react';
import { PageHero, Section } from '../components/Section.jsx';
import { Link } from '../components/Router.jsx';

const faqItems = [
  {
    question: 'A Tornogran atende empresas fora do Espírito Santo?',
    answer:
      'Sim. A Tornogran atende demandas industriais de mineração, máquinas pesadas e manutenção em diferentes regiões do Brasil.',
  },
  {
    question: 'Quais arquivos posso enviar para orçamento?',
    answer:
      'O formulário aceita PDF, DWG, DXF, STEP, JPG e PNG, com limite de até 20MB por solicitação.',
  },
  {
    question: 'A empresa fabrica peças sob desenho?',
    answer:
      'Sim. A Tornogran fabrica peças sob desenho, amostra ou necessidade de campo, considerando aplicação, material e exigência operacional.',
  },
  {
    question: 'A Tornogran trabalha com soluções em Hardox?',
    answer:
      'Sim. A empresa atua com soluções antidesgaste em Hardox para componentes submetidos a abrasão, impacto e ciclos severos de operação.',
  },
  {
    question: 'O painel administrativo altera o site publicado?',
    answer:
      'Sim. As alterações confirmadas no painel são salvas no navegador e atualizam as áreas do site conectadas ao CMS.',
  },
];

export function Faq() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Dúvidas frequentes"
        text="Informações rápidas sobre orçamento, atendimento, arquivos técnicos, fabricação sob demanda e soluções industriais."
        backgroundImage="/assets/oficina-geral.png"
        imageAlt="Oficina industrial Tornogran"
      />
      <Section>
        <div className="seo-faq-list">
          {faqItems.map((item) => (
            <article key={item.question} className="seo-faq-item">
              <HelpCircle size={22} />
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link path="/contato" className="primary-button">
            Solicitar orçamento
          </Link>
        </div>
      </Section>
    </>
  );
}
