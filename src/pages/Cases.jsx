import { IndustrialCases } from '../components/IndustrialCases.jsx';
import { PageHero, Section } from '../components/Section.jsx';

export function Cases() {
  return (
    <>
      <PageHero
        eyebrow="Cases"
        title="Portfólio industrial"
        text="Projetos com foco em recuperação, fabricação e soluções para operações de alta exigência."
        backgroundImage="/assets/oficina-geral.png"
        imageAlt="Estrutura industrial da Tornogran"
      />
      <Section>
        <IndustrialCases initialVisible={2} increment={2} showMore />
      </Section>
    </>
  );
}
