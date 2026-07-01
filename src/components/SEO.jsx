const SITE_URL = 'https://www.tornogran.com.br';

function upsertMeta(selector, createAttributes, content) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    Object.entries(createAttributes).forEach(([key, value]) => element.setAttribute(key, value));
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertCanonical(url) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
}

export const seoConfig = {
  '/': {
    title: 'TORNOGRAN LTDA | Usinagem pesada para operações críticas',
    description:
      'Usinagem pesada, recuperação de componentes e fabricação sob demanda para mineração, máquinas pesadas e indústrias.',
  },
  '/sobre': {
    title: 'Sobre a TORNOGRAN | Estrutura, qualidade e segurança',
    description:
      'Conheça a história, estrutura e compromisso da TORNOGRAN com qualidade, segurança e atendimento industrial.',
  },
  '/servicos': {
    title: 'Serviços industriais | Usinagem pesada, soldagem e recuperação',
    description:
      'Serviços de usinagem pesada, recuperação de componentes, manutenção industrial, soldagem e fabricação sob demanda.',
  },
  '/hardox': {
    title: 'Hardox Wearparts | Soluções antidesgaste TORNOGRAN',
    description:
      'Aplicações em aço Hardox para mineração, componentes de alta durabilidade e operações de alto desgaste.',
  },
  '/contato': {
    title: 'Contato TORNOGRAN | Solicite orçamento industrial',
    description:
      'Fale com a TORNOGRAN, solicite orçamento e envie sua demanda de usinagem, recuperação ou manutenção industrial.',
  },
  '/cases': {
    title: 'Cases industriais | Portfólio TORNOGRAN',
    description:
      'Cases industriais da TORNOGRAN com recuperação, fabricação e soluções técnicas para mineração e máquinas pesadas.',
  },
  '/faq': {
    title: 'FAQ TORNOGRAN | Dúvidas sobre orçamento e serviços industriais',
    description:
      'Perguntas frequentes sobre orçamento, arquivos técnicos, atendimento, fabricação sob demanda e soluções industriais da TORNOGRAN.',
  },
};

export const defaultSeo = {
  title: 'Página não encontrada | TORNOGRAN LTDA',
  description: 'A página solicitada não foi encontrada. Volte para o site da TORNOGRAN ou solicite atendimento.',
};

export function applySEO(path, seo = defaultSeo) {
  const canonical = `${SITE_URL}${path === '/' ? '/' : path}`;
  const image = `${SITE_URL}/assets/hero-fachada-tornogran-optimized.jpg`;

  document.title = seo.title;
  upsertCanonical(canonical);
  upsertMeta('meta[name="description"]', { name: 'description' }, seo.description);
  upsertMeta('meta[property="og:title"]', { property: 'og:title' }, seo.title);
  upsertMeta('meta[property="og:description"]', { property: 'og:description' }, seo.description);
  upsertMeta('meta[property="og:url"]', { property: 'og:url' }, canonical);
  upsertMeta('meta[property="og:image"]', { property: 'og:image' }, image);
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, seo.title);
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, seo.description);
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, image);
}
