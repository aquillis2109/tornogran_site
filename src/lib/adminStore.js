import { industrialCases } from '../data/cases.js';
import { services } from '../data/site.js';

const keys = {
  session: 'tornogran:adminSession',
  leads: 'tornogran:adminLeads',
  cases: 'tornogran:adminCases',
  services: 'tornogran:adminServices',
  gallery: 'tornogran:adminGallery',
  content: 'tornogran:adminContent',
  settings: 'tornogran:adminSettings',
  seo: 'tornogran:adminSeo',
};

export const adminUser = {
  email: 'admin@tornogran.com.br',
  password: 'Tornogran@2026',
  name: 'Administrador Tornogran',
};

export const leadStatuses = ['Novo', 'Em atendimento', 'Respondido', 'Concluído'];

export const mediaCategories = [
  'Hero',
  'Sobre',
  'Serviços',
  'Hardox',
  'Cases',
  'Galeria',
  'Equipe',
  'Estrutura',
  'Antes e Depois',
  'Outros',
];

export const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
export const maxImageSize = 8 * 1024 * 1024;

const defaultContent = {
  heroTitle: 'Força industrial para operações críticas',
  heroSubtitle:
    'Recuperação de componentes, fabricação sob desenho, soldagem industrial e soluções em Hardox para operações de alta exigência.',
  homeHeroImage: { src: '/assets/fachada-tornogran.png', alt: 'Fachada industrial da Tornogran' },
  homeHardoxImage: { src: '/assets/chapas-hardox.jpg', alt: 'Chapas de aço Hardox' },
  homeStructureImage: { src: '/assets/oficina-geral.png', alt: 'Estrutura industrial da Tornogran' },
  servicesBannerImage: { src: '/assets/oficina-cnc-ampla.png', alt: 'Oficina industrial com usinagem pesada e manutenção' },
  homeGalleryImages: [
    { src: '/assets/oficina-geral.png', alt: 'Oficina industrial' },
    { src: '/assets/whatsapp-concha-cinza-lateral.jpeg', alt: 'Concha fabricada sob demanda' },
    { src: '/assets/whatsapp-concha-cinza-frontal.jpeg', alt: 'Componente de grande porte' },
    { src: '/assets/whatsapp-concha-hardox-frontal.jpeg', alt: 'Concha Hardox finalizada' },
    { src: '/assets/soldagem-campo.png', alt: 'Soldagem em componente pesado' },
    { src: '/assets/concha-fachada.png', alt: 'Peças sob demanda' },
    { src: '/assets/instagram-concha-fachada.jpg', alt: 'Concha sob demanda' },
    { src: '/assets/instagram-operacao-campo.jpg', alt: 'Operação em campo' },
    { src: '/assets/instagram-hardox-soldado.jpg', alt: 'Soluções antidesgaste' },
    { src: '/assets/whatsapp-concha-cinza-dentes.jpeg', alt: 'Acabamento e dentes reforçados' },
  ],
  aboutMainImage: { src: '/assets/fachada-tornogran.png', alt: 'Estrutura da Tornogran' },
  aboutTeamImage: { src: '/assets/oficina-cnc-ampla.png', alt: 'Equipe técnica em operação' },
  aboutStructureImage: { src: '/assets/oficina-geral.png', alt: 'Estrutura industrial' },
  hardoxMainImage: { src: '/assets/chapas-hardox.jpg', alt: 'Chapas Hardox' },
  hardoxGalleryImages: [
    { src: '/assets/whatsapp-concha-hardox-frontal.jpeg', alt: 'Concha Hardox finalizada' },
    { src: '/assets/whatsapp-concha-hardox-suspensa.jpeg', alt: 'Componente Hardox suspenso' },
    { src: '/assets/whatsapp-concha-hardox-vermelha.jpeg', alt: 'Aplicação Hardox em concha' },
    { src: '/assets/concha-fachada.png', alt: 'Concha sob demanda' },
    { src: '/assets/hardox-concha-02.jpg', alt: 'Componente antidesgaste' },
    { src: '/assets/instagram-concha-carregadeira.jpg', alt: 'Concha para grande porte' },
    { src: '/assets/instagram-hardox-soldado.jpg', alt: 'Aplicação antidesgaste' },
  ],
  aboutTitle: 'Principais pontos sobre a empresa',
  hardoxTitle: 'Soluções em Hardox para mineração',
  footerText: 'TORNOGRAN LTDA - indústria, recuperação e fabricação para operações pesadas.',
};

const defaultServiceImages = {
  'usinagem-pesada': {
    image: { src: '/assets/oficina-cnc-ampla.png', alt: 'Máquina CNC em operação na Tornogran' },
    gallery: [
      { src: '/assets/servico-corte-cnc.jpg', alt: 'Corte CNC em chapa industrial' },
      { src: '/assets/oficina-geral.png', alt: 'Oficina industrial Tornogran' },
    ],
  },
  'recuperacao-de-componentes': {
    image: { src: '/assets/recuperacao-cat-antes.png', alt: 'Componente CAT antes da recuperação' },
    gallery: [
      { src: '/assets/recuperacao-cat-depois.png', alt: 'Componente CAT recuperado' },
      { src: '/assets/servico-recuperacao.jpg', alt: 'Recuperação de componente industrial' },
    ],
  },
  'manutencao-industrial': {
    image: { src: '/assets/maquina-pesada-entrega.png', alt: 'Máquina pesada em operação atendida pela Tornogran' },
    gallery: [
      { src: '/assets/instagram-operacao-campo.jpg', alt: 'Operação em campo com máquina pesada' },
      { src: '/assets/oficina-geral.png', alt: 'Estrutura de manutenção industrial' },
    ],
  },
  soldagem: {
    image: { src: '/assets/soldagem-campo.png', alt: 'Soldagem em componente pesado' },
    gallery: [
      { src: '/assets/servico-soldagem.jpg', alt: 'Soldagem industrial' },
      { src: '/assets/servico-esmerilhamento.jpg', alt: 'Acabamento em componente industrial' },
    ],
  },
  'fabricacao-sob-demanda': {
    image: { src: '/assets/concha-fachada.png', alt: 'Peça sob demanda fabricada pela Tornogran' },
    gallery: [
      { src: '/assets/instagram-concha-fachada.jpg', alt: 'Concha sob demanda' },
      { src: '/assets/whatsapp-concha-cinza-final.jpeg', alt: 'Componente fabricado sob demanda' },
    ],
  },
};

const defaultSettings = {
  phone: '(27) 3732-8596',
  whatsapp: '(27) 99883-4130',
  email: 'contato@tornogran.com.br',
  instagram: 'https://www.instagram.com/tornogran/',
  facebook: '',
  linkedin: '',
  address: 'Rua Projetada H, S/N, Quadra 01, Lote 01 e 02 Polo Empresarial, Baixo Guandu - ES',
  maps: 'https://maps.app.goo.gl/RwVPFhe5uSEfH5tM6',
  hours: 'Segunda a quinta: 07h às 18h; sexta: 07h às 16h',
};

const defaultSeo = {
  title: 'Tornogran | Usinagem pesada e recuperação industrial',
  description:
    'Usinagem pesada, recuperação industrial, fabricação sob desenho e soluções Hardox para mineração e máquinas pesadas.',
  keywords: 'usinagem pesada, recuperação industrial, Hardox, mineração, máquinas pesadas',
  ogImage: '/assets/og-image.svg',
};

const defaultGallery = [
  {
    id: 'media-home-hero',
    name: 'Fachada Tornogran',
    src: '/assets/fachada-tornogran.png',
    url: '/assets/fachada-tornogran.png',
    category: 'Hero',
    alt: 'Fachada industrial da Tornogran',
    type: 'image/png',
    size: 0,
    createdAt: '2026-06-26T00:00:00.000Z',
  },
  {
    id: 'media-oficina-geral',
    name: 'Oficina industrial',
    src: '/assets/oficina-geral.png',
    url: '/assets/oficina-geral.png',
    category: 'Estrutura',
    alt: 'Estrutura industrial da Tornogran',
    type: 'image/png',
    size: 0,
    createdAt: '2026-06-26T00:00:00.000Z',
  },
  {
    id: 'media-oficina-cnc',
    name: 'Oficina CNC',
    src: '/assets/oficina-cnc-ampla.png',
    url: '/assets/oficina-cnc-ampla.png',
    category: 'Serviços',
    alt: 'Máquina CNC em operação na Tornogran',
    type: 'image/png',
    size: 0,
    createdAt: '2026-06-26T00:00:00.000Z',
  },
  {
    id: 'media-soldagem-campo',
    name: 'Soldagem em campo',
    src: '/assets/soldagem-campo.png',
    url: '/assets/soldagem-campo.png',
    category: 'Serviços',
    alt: 'Soldagem em componente pesado',
    type: 'image/png',
    size: 0,
    createdAt: '2026-06-26T00:00:00.000Z',
  },
  {
    id: 'media-hardox-chapas',
    name: 'Chapas Hardox',
    src: '/assets/chapas-hardox.jpg',
    url: '/assets/chapas-hardox.jpg',
    category: 'Hardox',
    alt: 'Chapas de aço Hardox',
    type: 'image/jpeg',
    size: 0,
    createdAt: '2026-06-26T00:00:00.000Z',
  },
  {
    id: 'media-cat-antes',
    name: 'Traseira CAT antes',
    src: '/assets/recuperacao-cat-antes.png',
    url: '/assets/recuperacao-cat-antes.png',
    category: 'Antes e Depois',
    alt: 'Traseira CAT antes da recuperação',
    type: 'image/png',
    size: 0,
    createdAt: '2026-06-26T00:00:00.000Z',
  },
  {
    id: 'media-cat-depois',
    name: 'Traseira CAT depois',
    src: '/assets/recuperacao-cat-depois.png',
    url: '/assets/recuperacao-cat-depois.png',
    category: 'Antes e Depois',
    alt: 'Traseira CAT depois da recuperação',
    type: 'image/png',
    size: 0,
    createdAt: '2026-06-26T00:00:00.000Z',
  },
];

const additionalDefaultGallery = [
  ['media-hero-otimizada', 'Hero fachada Tornogran', '/assets/hero-fachada-tornogran-optimized.jpg', 'Hero', 'Fachada da Tornogran com estrutura industrial e máquinas pesadas', 'image/jpeg'],
  ['media-concha-cinza-lateral', 'Concha fabricada sob demanda', '/assets/whatsapp-concha-cinza-lateral.jpeg', 'Galeria', 'Concha fabricada sob demanda', 'image/jpeg'],
  ['media-concha-cinza-frontal', 'Componente de grande porte', '/assets/whatsapp-concha-cinza-frontal.jpeg', 'Galeria', 'Componente de grande porte', 'image/jpeg'],
  ['media-concha-hardox-frontal', 'Concha Hardox finalizada', '/assets/whatsapp-concha-hardox-frontal.jpeg', 'Hardox', 'Concha Hardox finalizada', 'image/jpeg'],
  ['media-concha-fachada', 'Peças sob demanda', '/assets/concha-fachada.png', 'Serviços', 'Peças sob demanda fabricadas pela Tornogran', 'image/png'],
  ['media-instagram-concha-fachada', 'Concha sob demanda', '/assets/instagram-concha-fachada.jpg', 'Galeria', 'Concha sob demanda', 'image/jpeg'],
  ['media-instagram-operacao-campo', 'Operação em campo', '/assets/instagram-operacao-campo.jpg', 'Galeria', 'Operação em campo', 'image/jpeg'],
  ['media-instagram-hardox-soldado', 'Soluções antidesgaste', '/assets/instagram-hardox-soldado.jpg', 'Hardox', 'Soluções antidesgaste', 'image/jpeg'],
  ['media-concha-cinza-dentes', 'Acabamento e dentes reforçados', '/assets/whatsapp-concha-cinza-dentes.jpeg', 'Galeria', 'Acabamento e dentes reforçados', 'image/jpeg'],
  ['media-hardox-suspensa', 'Componente Hardox suspenso', '/assets/whatsapp-concha-hardox-suspensa.jpeg', 'Hardox', 'Componente Hardox suspenso', 'image/jpeg'],
  ['media-hardox-vermelha', 'Aplicação Hardox em concha', '/assets/whatsapp-concha-hardox-vermelha.jpeg', 'Hardox', 'Aplicação Hardox em concha', 'image/jpeg'],
  ['media-hardox-concha-02', 'Componente antidesgaste', '/assets/hardox-concha-02.jpg', 'Hardox', 'Componente antidesgaste', 'image/jpeg'],
  ['media-concha-carregadeira', 'Concha para grande porte', '/assets/instagram-concha-carregadeira.jpg', 'Hardox', 'Concha para grande porte', 'image/jpeg'],
  ['media-corte-cnc', 'Corte CNC', '/assets/servico-corte-cnc.jpg', 'Serviços', 'Corte CNC em chapa industrial', 'image/jpeg'],
  ['media-servico-recuperacao', 'Recuperação industrial', '/assets/servico-recuperacao.jpg', 'Serviços', 'Recuperação de componente industrial', 'image/jpeg'],
  ['media-servico-soldagem', 'Soldagem industrial', '/assets/servico-soldagem.jpg', 'Serviços', 'Soldagem industrial', 'image/jpeg'],
  ['media-servico-esmerilhamento', 'Acabamento industrial', '/assets/servico-esmerilhamento.jpg', 'Serviços', 'Acabamento em componente industrial', 'image/jpeg'],
  ['media-maquina-entrega', 'Máquina pesada', '/assets/maquina-pesada-entrega.png', 'Serviços', 'Máquina pesada em operação atendida pela Tornogran', 'image/png'],
  ['media-concha-cinza-final', 'Componente fabricado sob demanda', '/assets/whatsapp-concha-cinza-final.jpeg', 'Galeria', 'Componente fabricado sob demanda', 'image/jpeg'],
  ['media-concha-recuperacao-antes', 'Componente desgastado', '/assets/whatsapp-concha-recuperacao-antes.jpeg', 'Antes e Depois', 'Componente desgastado antes da recuperação', 'image/jpeg'],
  ['media-concha-usada-oficina', 'Concha usada na oficina', '/assets/whatsapp-concha-usada-oficina.jpeg', 'Cases', 'Concha usada na oficina antes da recuperação', 'image/jpeg'],
  ['media-concha-cinza-oficina', 'Componente na oficina', '/assets/whatsapp-concha-cinza-oficina.jpeg', 'Cases', 'Componente industrial na oficina Tornogran', 'image/jpeg'],
].map(([id, name, src, category, alt, type]) => ({
  id,
  name,
  src,
  url: src,
  category,
  alt,
  type,
  size: 0,
  createdAt: '2026-06-26T00:00:00.000Z',
}));

function mergeDefaultGallery(items) {
  const bySrc = new Set(items.map((item) => migrateAssetPath(item.src || item.url || '')));
  return [
    ...items,
    ...additionalDefaultGallery.filter((item) => !bySrc.has(item.src)),
  ];
}

function safeJsonParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function read(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  return safeJsonParse(window.localStorage.getItem(key), fallback);
}

function write(key, value) {
  if (typeof window === 'undefined') return value;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('tornogran:admin-data', { detail: { key } }));
  return value;
}

function sanitizeFileName(name = 'imagem') {
  const extension = name.includes('.') ? `.${name.split('.').pop().toLowerCase()}` : '';
  const baseName = name
    .replace(/\.[^/.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);

  return `${baseName || 'imagem'}${extension}`;
}

function migrateAssetPath(src = '') {
  const migrations = {
    '/assets/chapas-aco-hardox-01.jpg': '/assets/chapas-hardox.jpg',
  };
  return migrations[src] || src;
}

function extensionFromType(type) {
  return {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  }[type];
}

export function validateImageFile(file) {
  if (!file) return 'Selecione uma imagem.';
  if (!acceptedImageTypes.includes(file.type)) return 'Envie apenas imagens JPG, PNG ou WEBP.';
  if (file.size > maxImageSize) return 'A imagem deve ter no máximo 8MB.';
  if (!extensionFromType(file.type)) return 'Tipo de imagem não permitido.';
  return '';
}

export function normalizeImageValue(value) {
  if (!value) return null;
  if (typeof value === 'string') return { src: value, url: value, alt: '' };
  const src = migrateAssetPath(value.src || value.url || '');
  if (!src) return null;
  return {
    id: value.id,
    name: value.name,
    src,
    url: migrateAssetPath(value.url || src),
    category: value.category,
    alt: value.alt || value.name || '',
    type: value.type,
    size: value.size,
    createdAt: value.createdAt,
  };
}

export function normalizeMediaItem(item, index = 0) {
  const src = migrateAssetPath(item.src || item.url || '');
  const name = item.name || item.alt || `Imagem ${index + 1}`;
  return {
    id: item.id || `media-${Date.now()}-${index}`,
    name,
    src,
    url: migrateAssetPath(item.url || src),
    category: mediaCategories.includes(item.category) ? item.category : 'Outros',
    alt: item.alt || name,
    type: item.type || 'image/jpeg',
    size: Number(item.size || 0),
    createdAt: item.createdAt || new Date().toISOString(),
  };
}

export function createMediaItem({ file, dataUrl, category = 'Outros', alt = '' }) {
  const cleanName = sanitizeFileName(file.name);
  return normalizeMediaItem({
    id: `media-${Date.now()}-${cleanName}`,
    name: cleanName,
    src: dataUrl,
    url: dataUrl,
    category,
    alt: alt || cleanName.replace(/\.[^.]+$/, '').replace(/-/g, ' '),
    type: file.type,
    size: file.size,
    createdAt: new Date().toISOString(),
  });
}

function createToken() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `token-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toCaseDefaults(caseItem, index) {
  const slug =
    caseItem.slug ||
    caseItem.title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  return {
    id: caseItem.id || `case-${index + 1}`,
    slug,
    title: caseItem.title,
    summary: caseItem.summary || caseItem.result,
    segment: caseItem.segment,
    category: caseItem.category || caseItem.segment,
    challenge: caseItem.challenge,
    solution: caseItem.solution,
    result: caseItem.result,
    before: caseItem.before,
    after: caseItem.after,
    gallery: caseItem.gallery || [],
    seoTitle: caseItem.seoTitle || `${caseItem.title} | Tornogran`,
    seoDescription: caseItem.seoDescription || caseItem.summary || caseItem.result,
    published: caseItem.published !== false,
    updatedAt: caseItem.updatedAt || new Date().toISOString(),
  };
}

export function getSession() {
  const session = read(keys.session, null);
  if (!session?.token || !session?.email) return null;
  return session;
}

export function isAuthenticated() {
  return Boolean(getSession());
}

export function loginAdmin(email, password) {
  if (email !== adminUser.email || password !== adminUser.password) {
    throw new Error('Credenciais inválidas.');
  }

  return write(keys.session, {
    token: createToken(),
    email,
    name: adminUser.name,
    role: 'admin',
    authenticatedAt: new Date().toISOString(),
  });
}

export function logoutAdmin() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(keys.session);
    window.dispatchEvent(new CustomEvent('tornogran:admin-data', { detail: { key: keys.session } }));
  }
}

export function requestPasswordReset(email) {
  return {
    email,
    requestedAt: new Date().toISOString(),
    message: 'Instruções de recuperação preparadas para envio por e-mail.',
  };
}

export function getLeads() {
  return read(keys.leads, []);
}

export function saveLeads(leads) {
  return write(keys.leads, leads);
}

export function addLeadFromQuote(payload) {
  const lead = {
    id: `lead-${Date.now()}`,
    name: payload.contact.name || '',
    company: payload.contact.company || '',
    role: payload.contact.role || '',
    phone: payload.contact.phone || '',
    email: payload.contact.email || '',
    service: payload.request.service || '',
    message: payload.request.description || '',
    city: payload.contact.city || '',
    state: payload.contact.state || '',
    attachment: payload.attachment,
    status: 'Novo',
    date: payload.submittedAt || new Date().toISOString(),
  };

  saveLeads([lead, ...getLeads()]);
  return lead;
}

export function getCases(includeDrafts = false) {
  const stored = read(keys.cases, null);
  const cases = stored || industrialCases.map(toCaseDefaults);
  return includeDrafts ? cases : cases.filter((caseItem) => caseItem.published !== false);
}

export function saveCases(cases) {
  return write(keys.cases, cases);
}

export function getServices() {
  const defaults = services.map((service, index) => ({
    id: service.slug,
    slug: service.slug,
    name: service.title,
    description: service.intro,
    image: defaultServiceImages[service.slug]?.image || '',
    gallery: defaultServiceImages[service.slug]?.gallery || [],
    icon: service.slug,
    seoTitle: `${service.title} | Tornogran`,
    seoDescription: service.intro,
    order: index + 1,
    published: true,
  }));

  return read(keys.services, defaults);
}

export function saveServices(items) {
  return write(keys.services, items);
}

export function getGallery() {
  return mergeDefaultGallery(read(keys.gallery, defaultGallery)).map(normalizeMediaItem);
}

export function saveGallery(items) {
  return write(keys.gallery, items.map(normalizeMediaItem));
}

export function getContent() {
  const content = read(keys.content, defaultContent);
  return {
    ...content,
    homeHeroImage: normalizeImageValue(content.homeHeroImage),
    homeHardoxImage: normalizeImageValue(content.homeHardoxImage),
    homeStructureImage: normalizeImageValue(content.homeStructureImage),
    servicesBannerImage: normalizeImageValue(content.servicesBannerImage),
    homeGalleryImages: (content.homeGalleryImages || []).map(normalizeImageValue).filter(Boolean),
    aboutMainImage: normalizeImageValue(content.aboutMainImage),
    aboutTeamImage: normalizeImageValue(content.aboutTeamImage),
    aboutStructureImage: normalizeImageValue(content.aboutStructureImage),
    hardoxMainImage: normalizeImageValue(content.hardoxMainImage),
    hardoxGalleryImages: (content.hardoxGalleryImages || []).map(normalizeImageValue).filter(Boolean),
  };
}

export function saveContent(content) {
  return write(keys.content, content);
}

export function getSettings() {
  return read(keys.settings, defaultSettings);
}

export function saveSettings(settings) {
  return write(keys.settings, settings);
}

export function getSeo() {
  return read(keys.seo, defaultSeo);
}

export function saveSeo(seo) {
  return write(keys.seo, seo);
}

export function exportLeadsCsv(leads) {
  const columns = ['Nome', 'Empresa', 'Cargo', 'Telefone', 'Email', 'Serviço', 'Cidade', 'Estado', 'Status', 'Data', 'Mensagem'];
  const rows = leads.map((lead) => [
    lead.name,
    lead.company,
    lead.role,
    lead.phone,
    lead.email,
    lead.service,
    lead.city,
    lead.state,
    lead.status,
    lead.date,
    lead.message,
  ]);

  const csv = [columns, ...rows]
    .map((row) => row.map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`).join(';'))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `leads-tornogran-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function listenAdminData(callback) {
  const handler = (event) => callback(event.detail?.key);
  window.addEventListener('tornogran:admin-data', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('tornogran:admin-data', handler);
    window.removeEventListener('storage', handler);
  };
}
