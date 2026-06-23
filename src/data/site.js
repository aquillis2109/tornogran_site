import {
  Factory,
  Hammer,
  HardHat,
  ShieldCheck,
  Sparkles,
  TimerReset,
} from 'lucide-react';

export const whatsappNumber = '5527998834130';
export const whatsappMessage = encodeURIComponent(
  'Olá, gostaria de solicitar um orçamento com a TORNOGRAN LTDA.',
);
export const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
export const instagramUrl = 'https://www.instagram.com/tornogran/';

export const services = [
  {
    slug: 'usinagem-pesada',
    title: 'Usinagem pesada',
    icon: Factory,
    intro: 'Capacidade técnica para componentes de grande porte, com precisão dimensional e foco em disponibilidade operacional.',
    details: [
      'Torneamento, fresamento e ajustes em peças críticas',
      'Atendimento para componentes de mineração e máquinas pesadas',
      'Controle de medidas, acabamento e tolerâncias conforme aplicação',
    ],
  },
  {
    slug: 'recuperacao-de-componentes',
    title: 'Recuperação de componentes',
    icon: TimerReset,
    intro: 'Recuperação técnica para prolongar a vida útil de peças desgastadas e reduzir paradas não planejadas.',
    details: [
      'Análise do desgaste e da condição do componente',
      'Recomposição, usinagem e acabamento funcional',
      'Alternativa estratégica à substituição de alto custo',
    ],
  },
  {
    slug: 'manutencao-industrial',
    title: 'Manutenção industrial',
    icon: HardHat,
    intro: 'Apoio técnico para manter equipamentos produtivos, seguros e prontos para ciclos intensos de operação.',
    details: [
      'Intervenções corretivas e preventivas',
      'Ajustes, reformas e fabricação de partes mecânicas',
      'Suporte para plantas industriais e mineradoras',
    ],
  },
  {
    slug: 'soldagem',
    title: 'Soldagem',
    icon: Sparkles,
    intro: 'Soldagem industrial aplicada à recuperação, reforço e fabricação de estruturas e componentes.',
    details: [
      'Reforços, recomposição e união de conjuntos metálicos',
      'Preparação adequada de juntas e superfícies',
      'Acabamento integrado à usinagem quando necessário',
    ],
  },
  {
    slug: 'fabricacao-sob-demanda',
    title: 'Fabricação sob demanda',
    icon: Hammer,
    intro: 'Produção de peças especiais para quando a solução pronta não atende a urgência, o encaixe ou a resistência necessária.',
    details: [
      'Execução por desenho, amostra ou engenharia reversa',
      'Materiais e geometrias definidos pela aplicação',
      'Foco em confiabilidade, prazo e custo operacional',
    ],
  },
];

export const differentials = [
  {
    title: 'Atuação em componentes críticos',
    text: 'Experiência com peças que operam sob carga, abrasão e alto impacto.',
    icon: ShieldCheck,
  },
  {
    title: 'Resposta para paradas',
    text: 'Fluxo orientado para reduzir tempo de máquina parada e proteger a produção.',
    icon: TimerReset,
  },
  {
    title: 'Execução integrada',
    text: 'Usinagem, soldagem e recuperação trabalhando como uma solução única.',
    icon: Factory,
  },
];

export const processSteps = [
  'Diagnóstico técnico da demanda',
  'Definição de material, processo e prazo',
  'Execução com controle dimensional',
  'Entrega, orientação e suporte pós-serviço',
];

export const hardoxApplications = [
  'Revestimentos contra desgaste',
  'Caçambas, chutes e tremonhas',
  'Proteções de equipamentos de beneficiamento',
  'Guias, raspadores e componentes sujeitos à abrasão',
  'Peças especiais para transporte e processamento mineral',
];

export const audiences = ['Mineradoras', 'Máquinas pesadas', 'Indústrias'];
export const contactPhone = '(27) 3732-8596';
export const contactWhatsapp = '(27) 99883-4130';
export const contactPhones = `${contactPhone} / ${contactWhatsapp}`;
export const contactEmail = 'contato@tornogran.com.br';
export const secondaryEmail = 'ramon.moreira@tornogran.com.br';
export const contactEmails = `${contactEmail} / ${secondaryEmail}`;
export const contactAddress = 'Rua Projetada H, S/N, Quadra 01, Lote 01 e 02 Polo Empresarial, Baixo Guandu - ES, CEP 29.730-000';
export const businessHours = 'Seg a Quinta: 07 às 18 horas; Sexta: 07 às 16 horas';
export const geoLatitude = '-19.52398147877878';
export const geoLongitude = '-41.00197220336942';
export const googleMapsQuery = `${geoLatitude},${geoLongitude}`;
export const googleMapsPlaceQuery = encodeURIComponent(
  'TORNOGRAN LTDA Rua Projetada H Polo Empresarial Baixo Guandu ES',
);
export const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${googleMapsQuery}`;
export const googleMapsEmbedUrl = `https://www.google.com/maps?q=${googleMapsPlaceQuery}&output=embed`;
export const googleBusinessProfileUrl =
  import.meta.env.VITE_GOOGLE_BUSINESS_PROFILE_URL || 'https://maps.app.goo.gl/RwVPFhe5uSEfH5tM6';
export const serviceArea = 'Atendimento técnico para mineração, máquinas pesadas e indústrias em todo o Brasil.';
