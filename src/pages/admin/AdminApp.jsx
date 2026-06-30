import {
  BarChart3,
  Briefcase,
  CheckCircle2,
  Edit3,
  FileImage,
  FolderKanban,
  Gauge,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from '../../components/Router.jsx';
import { ExportMenu } from '../../components/admin/ExportMenu.jsx';
import {
  adminUser,
  getCases,
  getContent,
  getGallery,
  getLeads,
  getSeo,
  getServices,
  getSession,
  getSettings,
  leadStatuses,
  loginAdmin,
  logoutAdmin,
  requestPasswordReset,
  saveCases,
  saveContent,
  saveLeads,
  saveSeo,
  saveServices,
  saveSettings,
  createMediaItem,
  maxImageSize,
  mediaCategories,
  normalizeImageValue,
  saveGallery,
  validateImageFile,
} from '../../lib/adminStore.js';
import { ImagePicker } from '../../components/admin/ImagePicker.jsx';

const adminNav = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/leads', label: 'Leads', icon: Users },
  { path: '/admin/cases', label: 'Cases', icon: FolderKanban },
  { path: '/admin/services', label: 'Serviços', icon: Briefcase },
  { path: '/admin/media', label: 'Mídia', icon: FileImage },
  { path: '/admin/settings', label: 'Configurações', icon: Settings },
  { path: '/admin/seo', label: 'SEO', icon: Gauge },
];

const adminAliases = {
  '/admin': '/admin/login',
  '/admin/servicos': '/admin/services',
  '/admin/galeria': '/admin/media',
  '/admin/conteudo': '/admin/settings',
  '/admin/configuracoes': '/admin/settings',
  '/admin/recuperar-senha': '/admin/recover',
};

const leadExportColumns = [
  { key: 'name', label: 'Nome', value: (lead) => lead.name },
  { key: 'company', label: 'Empresa', value: (lead) => lead.company },
  { key: 'role', label: 'Cargo', value: (lead) => lead.role },
  { key: 'phone', label: 'Telefone', value: (lead) => lead.phone },
  { key: 'email', label: 'Email', value: (lead) => lead.email },
  { key: 'service', label: 'Serviço', value: (lead) => lead.service },
  { key: 'city', label: 'Cidade', value: (lead) => lead.city },
  { key: 'state', label: 'Estado', value: (lead) => lead.state },
  { key: 'status', label: 'Status', value: (lead) => lead.status },
  {
    key: 'date',
    label: 'Data',
    value: (lead) => (lead.date ? new Date(lead.date).toLocaleDateString('pt-BR') : ''),
  },
  { key: 'message', label: 'Mensagem', value: (lead) => lead.message, defaultSelected: false },
];

function isWithinDateFilter(date, filter) {
  if (filter === 'Todos') return true;
  if (!date) return false;

  const value = new Date(date).getTime();
  const now = Date.now();
  const days = {
    'Últimos 7 dias': 7,
    'Últimos 30 dias': 30,
    'Últimos 90 dias': 90,
  }[filter];

  if (!days) return true;
  return value >= now - days * 24 * 60 * 60 * 1000;
}

function displayMediaUrl(item) {
  const url = item.url || item.src || '';
  if (!url.startsWith('data:')) return url;
  return `Imagem enviada pelo painel (${item.name || item.type || 'arquivo local'})`;
}

const mediaPageTabs = ['Home', 'Sobre Nós', 'Hardox', 'Serviços', 'Cases', 'FAQ', 'Contato', 'Biblioteca Geral'];

const requiredImageNotice =
  'Esta imagem é obrigatória para o layout da página. Você pode substituí-la, mas não removê-la.';

const galleryImageNotice =
  'Esta galeria aceita múltiplas imagens. Você pode adicionar, remover e reorganizar as fotos.';

function goToPath(path) {
  if (window.location.protocol === 'file:') {
    window.location.hash = path;
  } else {
    window.history.pushState({}, '', path);
  }
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function useStoredState(loader, saver) {
  const [value, setValue] = useState(loader);
  const [savedMessage, setSavedMessage] = useState('');

  function confirm(message = 'Alterações confirmadas com sucesso.') {
    saver(value);
    setSavedMessage(message);
    window.setTimeout(() => setSavedMessage(''), 3200);
  }

  return [value, setValue, confirm, savedMessage];
}

function readFileAsDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function imageSrc(value) {
  return normalizeImageValue(value)?.src || '';
}

function imageList(value) {
  return (Array.isArray(value) ? value : []).map(normalizeImageValue).filter(Boolean);
}

function collectMediaUsage(image, { content, services, cases }) {
  const src = imageSrc(image);
  if (!src) return [];

  const usage = [];
  const add = (condition, label) => {
    if (condition) usage.push(label);
  };

  add(imageSrc(content.homeHeroImage) === src, 'Home > Hero');
  add(imageSrc(content.homeHardoxImage) === src, 'Home > Hardox');
  add(imageSrc(content.homeStructureImage) === src, 'Home > Estrutura');
  add(imageList(content.homeGalleryImages).some((item) => item.src === src), 'Home > Galeria inicial');
  add(imageSrc(content.servicesBannerImage) === src, 'Serviços > Banner');
  add(imageSrc(content.aboutMainImage) === src, 'Sobre > Imagem principal');
  add(imageSrc(content.aboutTeamImage) === src, 'Sobre > Equipe');
  add(imageSrc(content.aboutStructureImage) === src, 'Sobre > Estrutura');
  add(imageSrc(content.hardoxMainImage) === src, 'Hardox > Imagem principal');
  add(imageList(content.hardoxGalleryImages).some((item) => item.src === src), 'Hardox > Galeria');

  services.forEach((service) => {
    add(imageSrc(service.image) === src, `Serviços > ${service.name}`);
    add(imageList(service.gallery).some((item) => item.src === src), `Serviços > ${service.name} > Galeria`);
  });

  cases.forEach((caseItem) => {
    add(imageSrc(caseItem.before) === src, `Cases > ${caseItem.title} > Antes`);
    add(imageSrc(caseItem.after) === src, `Cases > ${caseItem.title} > Depois`);
    add(imageList(caseItem.gallery).some((item) => item.src === src), `Cases > ${caseItem.title} > Galeria`);
  });

  return usage;
}

function collectMediaUsageDetails(image, { content, services, cases }) {
  const src = imageSrc(image);
  if (!src) return [];

  const usage = [];
  const add = (condition, label, target) => {
    if (condition) usage.push({ label, target });
  };

  add(imageSrc(content.homeHeroImage) === src, 'Home > Hero', 'content|homeHeroImage|single');
  add(imageSrc(content.homeHardoxImage) === src, 'Home > Hardox', 'content|homeHardoxImage|single');
  add(imageSrc(content.homeStructureImage) === src, 'Home > Estrutura', 'content|homeStructureImage|single');
  add(imageList(content.homeGalleryImages).some((item) => item.src === src), 'Home > Galeria inicial', 'content|homeGalleryImages|multiple');
  add(imageSrc(content.servicesBannerImage) === src, 'Serviços > Banner', 'content|servicesBannerImage|single');
  add(imageSrc(content.aboutMainImage) === src, 'Sobre > Imagem principal', 'content|aboutMainImage|single');
  add(imageSrc(content.aboutTeamImage) === src, 'Sobre > Equipe', 'content|aboutTeamImage|single');
  add(imageSrc(content.aboutStructureImage) === src, 'Sobre > Estrutura', 'content|aboutStructureImage|single');
  add(imageSrc(content.hardoxMainImage) === src, 'Hardox > Imagem principal', 'content|hardoxMainImage|single');
  add(imageList(content.hardoxGalleryImages).some((item) => item.src === src), 'Hardox > Galeria', 'content|hardoxGalleryImages|multiple');

  services.forEach((service) => {
    add(imageSrc(service.image) === src, `Serviços > ${service.name}`, `service|${service.id}|image`);
    add(imageList(service.gallery).some((item) => item.src === src), `Serviços > ${service.name} > Galeria`, `service|${service.id}|gallery`);
  });

  cases.forEach((caseItem) => {
    add(imageSrc(caseItem.before) === src, `Cases > ${caseItem.title} > Antes`, `case|${caseItem.id}|before`);
    add(imageSrc(caseItem.after) === src, `Cases > ${caseItem.title} > Depois`, `case|${caseItem.id}|after`);
    add(imageList(caseItem.gallery).some((item) => item.src === src), `Cases > ${caseItem.title} > Galeria`, `case|${caseItem.id}|gallery`);
  });

  return usage;
}

function buildMediaTargets({ services, cases }) {
  const baseTargets = [
    { value: 'content|homeHeroImage|single', label: 'Home > Hero' },
    { value: 'content|homeHardoxImage|single', label: 'Home > Hardox' },
    { value: 'content|homeStructureImage|single', label: 'Home > Estrutura' },
    { value: 'content|homeGalleryImages|multiple', label: 'Home > Galeria inicial' },
    { value: 'content|aboutMainImage|single', label: 'Sobre > Imagem principal' },
    { value: 'content|aboutTeamImage|single', label: 'Sobre > Equipe' },
    { value: 'content|aboutStructureImage|single', label: 'Sobre > Estrutura' },
    { value: 'content|hardoxMainImage|single', label: 'Hardox > Imagem principal' },
    { value: 'content|hardoxGalleryImages|multiple', label: 'Hardox > Galeria' },
  ];

  const serviceTargets = services.flatMap((service) => [
    { value: `service|${service.id}|image`, label: `Serviços > ${service.name} > Imagem principal` },
    { value: `service|${service.id}|gallery`, label: `Serviços > ${service.name} > Galeria` },
  ]);

  const caseTargets = cases.flatMap((caseItem) => [
    { value: `case|${caseItem.id}|before`, label: `Cases > ${caseItem.title} > Antes` },
    { value: `case|${caseItem.id}|after`, label: `Cases > ${caseItem.title} > Depois` },
    { value: `case|${caseItem.id}|gallery`, label: `Cases > ${caseItem.title} > Galeria` },
  ]);

  return [...baseTargets, ...serviceTargets, ...caseTargets];
}

function MediaBreadcrumb({ page, section }) {
  return (
    <div className="admin-media-breadcrumb">
      <span>Mídia</span>
      <span>{page}</span>
      {section && <span>{section}</span>}
    </div>
  );
}

function MediaSection({ page, title, text, children }) {
  return (
    <article className="admin-media-section">
      <MediaBreadcrumb page={page} section={title} />
      <div className="admin-media-section-head">
        <div>
          <h2>{title}</h2>
          {text && <p>{text}</p>}
        </div>
      </div>
      {children}
    </article>
  );
}

function RequiredImageField({ label, value, category, onChange }) {
  return (
    <ImagePicker
      label={label}
      value={value}
      category={category}
      required
      notice={requiredImageNotice}
      onChange={onChange}
    />
  );
}

function FlexibleGalleryField({ label, value, category, onChange }) {
  return (
    <ImagePicker
      label={label}
      value={value || []}
      category={category}
      multiple
      notice={galleryImageNotice}
      onChange={onChange}
    />
  );
}

function Redirect({ to }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to);
  }, [navigate, to]);

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-card">
        <img src="/assets/tornogran-logo.png" alt="Tornogran" />
        <p>Carregando painel...</p>
      </div>
    </div>
  );
}

function AdminLogin({ mode = 'login' }) {
  const [email, setEmail] = useState(adminUser.email);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const isRecovery = mode === 'recovery';

  function handleLogin(event) {
    event.preventDefault();
    setError('');
    try {
      loginAdmin(email, password);
      goToPath('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  function handleRecovery(event) {
    event.preventDefault();
    const response = requestPasswordReset(email);
    setMessage(response.message);
    setError('');
  }

  return (
    <main className="admin-auth">
      <section className="admin-auth-card">
        <div className="admin-brand">
          <img src="/assets/tornogran-logo.png" alt="Tornogran" />
          <span>Painel administrativo</span>
        </div>
        <h1>{isRecovery ? 'Recuperar senha' : 'Entrar no painel'}</h1>
        <p>
          Área reservada para atualização de conteúdo, leads, cases, serviços e configurações comerciais da Tornogran.
        </p>
        <form onSubmit={isRecovery ? handleRecovery : handleLogin} className="admin-form">
          <label>
            E-mail
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </label>
          {!isRecovery && (
            <label>
              Senha
              <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
            </label>
          )}
          <button type="submit" className="admin-primary">
            {isRecovery ? 'Enviar instruções' : 'Acessar painel'}
          </button>
          {message && <p className="admin-success">{message}</p>}
          {error && <p className="admin-error">{error}</p>}
        </form>
        <Link path={isRecovery ? '/admin/login' : '/admin/recover'} className="admin-auth-link">
          {isRecovery ? 'Voltar para login' : 'Esqueci minha senha'}
        </Link>
        <p className="admin-hint">Acesso inicial: {adminUser.email} / Tornogran@2026</p>
      </section>
    </main>
  );
}

function AdminLayout({ children, session }) {
  const path = useLocation();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logoutAdmin();
    goToPath('/admin/login');
  }

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${open ? 'admin-sidebar-open' : ''}`}>
        <div className="admin-sidebar-head">
          <img src="/assets/tornogran-logo.png" alt="Tornogran" />
          <button type="button" onClick={() => setOpen(false)} aria-label="Fechar menu">
            <X size={20} />
          </button>
        </div>
        <nav>
          {adminNav.map(({ path: navPath, label, icon: Icon }) => (
            <Link
              key={navPath}
              path={navPath}
              className={`admin-nav-link ${path === navPath ? 'admin-nav-link-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <button type="button" className="admin-logout" onClick={handleLogout}>
          <LogOut size={18} />
          Sair
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button type="button" onClick={() => setOpen(true)} className="admin-menu-button" aria-label="Abrir menu">
            <Menu size={22} />
          </button>
          <div>
            <span>TORNOGRAN CMS</span>
            <strong>Gestão do site</strong>
          </div>
          <div className="hidden text-right text-sm font-bold text-white/65 md:block">
            <span className="!text-white/45">{session.role}</span>
            {session.name}
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

function Dashboard() {
  const leads = getLeads();
  const cases = getCases(true);
  const services = getServices();
  const newLeads = leads.filter((lead) => lead.status === 'Novo').length;
  const cards = [
    { label: 'Total de visitas', value: 'GA4', text: 'Estrutura pronta para Analytics', icon: BarChart3 },
    { label: 'Formulários recebidos', value: leads.length, text: 'Solicitações registradas', icon: Users },
    { label: 'Novos leads', value: newLeads, text: 'Aguardando atendimento', icon: Sparkles },
    { label: 'Cases publicados', value: cases.filter((item) => item.published).length, text: 'Portfólio ativo', icon: FolderKanban },
    { label: 'Serviços cadastrados', value: services.length, text: 'Base comercial', icon: Briefcase },
  ];

  return (
    <section className="admin-page">
      <div className="admin-page-head">
        <p>Dashboard</p>
        <h1>Visão geral comercial</h1>
      </div>
      <div className="admin-kpi-grid">
        {cards.map(({ label, value, text, icon: Icon }) => (
          <article key={label} className="admin-kpi-card">
            <Icon size={22} />
            <strong>{value}</strong>
            <span>{label}</span>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <div className="admin-chart-card">
        <div>
          <p className="admin-mini-label">Leads por status</p>
          <h2>Pipeline de orçamento</h2>
        </div>
        <div className="admin-status-bars">
          {leadStatuses.map((status) => {
            const count = leads.filter((lead) => lead.status === status).length;
            const width = leads.length ? Math.max(8, (count / leads.length) * 100) : 8;
            return (
              <div key={status}>
                <span>{status}</span>
                <div>
                  <i style={{ width: `${width}%` }} />
                </div>
                <strong>{count}</strong>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LeadsAdmin() {
  const [leads, setLeads, confirmLeads, leadsMessage] = useStoredState(getLeads, saveLeads);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Todos');
  const [city, setCity] = useState('Todos');
  const [dateFilter, setDateFilter] = useState('Todos');

  const cities = useMemo(() => {
    return Array.from(new Set(leads.map((lead) => lead.city).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  }, [leads]);

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus = status === 'Todos' || lead.status === status;
      const matchesCity = city === 'Todos' || lead.city === city;
      const matchesDate = isWithinDateFilter(lead.date, dateFilter);
      const text = `${lead.name} ${lead.company} ${lead.email} ${lead.phone} ${lead.service} ${lead.city} ${lead.state} ${lead.message}`.toLowerCase();
      return matchesStatus && matchesCity && matchesDate && text.includes(query.toLowerCase());
    });
  }, [city, dateFilter, leads, query, status]);

  function updateStatus(id, nextStatus) {
    setLeads(leads.map((lead) => (lead.id === id ? { ...lead, status: nextStatus } : lead)));
  }

  return (
    <section className="admin-page">
      <div className="admin-page-head admin-page-head-row">
        <div>
          <p>Leads</p>
          <h1>Formulários recebidos</h1>
        </div>
        <div className="admin-head-actions">
          <button type="button" className="admin-primary" onClick={() => confirmLeads('Alterações dos leads confirmadas com sucesso.')}>
            Confirmar alterações
          </button>
          <ExportMenu
            rows={filtered}
            columns={leadExportColumns}
            filenamePrefix="leads"
            sheetName="Leads Tornogran"
            title="Leads Tornogran"
          />
        </div>
      </div>
      {leadsMessage && <p className="admin-success">{leadsMessage}</p>}
      <div className="admin-filters">
        <label>
          <Search size={17} />
          <input placeholder="Pesquisar lead" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option>Todos</option>
          {leadStatuses.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select value={city} onChange={(event) => setCity(event.target.value)}>
          <option>Todos</option>
          {cities.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}>
          <option>Todos</option>
          <option>Últimos 7 dias</option>
          <option>Últimos 30 dias</option>
          <option>Últimos 90 dias</option>
        </select>
      </div>
      <div className="admin-print-summary">
        <img src="/assets/tornogran-logo.png" alt="Tornogran" />
        <div>
          <strong>Leads Tornogran</strong>
          <span>Impressão: {new Date().toLocaleDateString('pt-BR')} - {filtered.length} registros</span>
        </div>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Empresa</th>
              <th>Contato</th>
              <th>Serviço</th>
              <th>Status</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <strong>{lead.name}</strong>
                  <span>{lead.role}</span>
                </td>
                <td>{lead.company || '-'}</td>
                <td>
                  <a href={`mailto:${lead.email}`}>{lead.email}</a>
                  <span>{lead.phone}</span>
                </td>
                <td>{lead.service || '-'}</td>
                <td>
                  <select value={lead.status} onChange={(event) => updateStatus(lead.id, event.target.value)}>
                    {leadStatuses.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </td>
                <td>{lead.date ? new Date(lead.date).toLocaleDateString('pt-BR') : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && <p className="admin-empty">Nenhum lead encontrado.</p>}
      </div>
    </section>
  );
}

function CasesAdmin() {
  const [cases, setCases, confirmCases, casesMessage] = useStoredState(() => getCases(true), saveCases);
  const [activeId, setActiveId] = useState(cases[0]?.id || '');
  const active = cases.find((caseItem) => caseItem.id === activeId) || cases[0];

  function updateActive(field, value) {
    setCases(cases.map((item) => (item.id === active.id ? { ...item, [field]: value, updatedAt: new Date().toISOString() } : item)));
  }

  function addCase() {
    const next = {
      id: `case-${Date.now()}`,
      slug: 'novo-case',
      title: 'Novo case industrial',
      summary: 'Resumo do case',
      segment: 'Recuperação industrial',
      category: 'Portfólio',
      challenge: '',
      solution: '',
      result: '',
      before: { src: '/assets/recuperacao-cat-antes.png', alt: 'Antes' },
      after: { src: '/assets/recuperacao-cat-depois.png', alt: 'Depois' },
      gallery: [],
      seoTitle: 'Novo case | Tornogran',
      seoDescription: '',
      published: false,
      updatedAt: new Date().toISOString(),
    };
    setCases([next, ...cases]);
    setActiveId(next.id);
  }

  function removeCase() {
    if (!active) return;
    const next = cases.filter((item) => item.id !== active.id);
    setCases(next);
    setActiveId(next[0]?.id || '');
  }

  return (
    <section className="admin-page">
      <div className="admin-page-head admin-page-head-row">
        <div>
          <p>Cases</p>
          <h1>Portfólio técnico</h1>
        </div>
        <div className="admin-head-actions">
          <button type="button" className="admin-secondary" onClick={addCase}>
            Criar case
          </button>
          <button type="button" className="admin-primary" onClick={() => confirmCases('Alterações dos cases confirmadas com sucesso.')}>
            Confirmar alterações
          </button>
        </div>
      </div>
      {casesMessage && <p className="admin-success">{casesMessage}</p>}
      <div className="admin-editor-grid">
        <div className="admin-list-panel">
          {cases.map((caseItem) => (
            <button
              key={caseItem.id}
              type="button"
              className={caseItem.id === active?.id ? 'active' : ''}
              onClick={() => setActiveId(caseItem.id)}
            >
              <strong>{caseItem.title}</strong>
              <span>{caseItem.published ? 'Publicado' : 'Rascunho'}</span>
            </button>
          ))}
        </div>
        {active && (
          <div className="admin-form-card">
            <div className="admin-form-grid">
              <label>
                Título
                <input value={active.title} onChange={(event) => updateActive('title', event.target.value)} />
              </label>
              <label>
                Slug amigável
                <input value={active.slug} onChange={(event) => updateActive('slug', event.target.value)} />
              </label>
              <label>
                Categoria
                <input value={active.category} onChange={(event) => updateActive('category', event.target.value)} />
              </label>
              <label>
                Segmento
                <input value={active.segment} onChange={(event) => updateActive('segment', event.target.value)} />
              </label>
              <label className="span-2">
                Resumo
                <textarea value={active.summary} onChange={(event) => updateActive('summary', event.target.value)} />
              </label>
              <label className="span-2">
                Desafio
                <textarea value={active.challenge} onChange={(event) => updateActive('challenge', event.target.value)} />
              </label>
              <label className="span-2">
                Solução
                <textarea value={active.solution} onChange={(event) => updateActive('solution', event.target.value)} />
              </label>
              <label className="span-2">
                Resultado
                <textarea value={active.result} onChange={(event) => updateActive('result', event.target.value)} />
              </label>
              <div>
                <ImagePicker
                  label="Imagem antes"
                  value={active.before}
                  category="Antes e Depois"
                  onChange={(image) => updateActive('before', image || { src: '', alt: '' })}
                />
              </div>
              <div>
                <ImagePicker
                  label="Imagem depois"
                  value={active.after}
                  category="Antes e Depois"
                  onChange={(image) => updateActive('after', image || { src: '', alt: '' })}
                />
              </div>
              <div className="span-2">
                <ImagePicker
                  label="Galeria do case"
                  value={active.gallery || []}
                  category="Cases"
                  multiple
                  onChange={(images) => updateActive('gallery', images)}
                />
              </div>
              <label>
                Meta title
                <input value={active.seoTitle} onChange={(event) => updateActive('seoTitle', event.target.value)} />
              </label>
              <label>
                Meta description
                <input value={active.seoDescription} onChange={(event) => updateActive('seoDescription', event.target.value)} />
              </label>
            </div>
            <div className="admin-form-actions">
              <label className="admin-switch">
                <input
                  type="checkbox"
                  checked={active.published}
                  onChange={(event) => updateActive('published', event.target.checked)}
                />
                Publicado
              </label>
              <button type="button" className="admin-danger" onClick={removeCase}>
                Excluir
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ServicesAdmin() {
  const [items, setItems, confirmServices, servicesMessage] = useStoredState(getServices, saveServices);

  function updateItem(id, field, value) {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  function addItem() {
    setItems([
      ...items,
      {
        id: `servico-${Date.now()}`,
        slug: 'novo-servico',
        name: 'Novo serviço',
        description: '',
        image: '',
        icon: 'factory',
        seoTitle: '',
        seoDescription: '',
        order: items.length + 1,
        published: true,
      },
    ]);
  }

  return (
    <section className="admin-page">
      <div className="admin-page-head admin-page-head-row">
        <div>
          <p>Serviços</p>
          <h1>Gerenciar serviços</h1>
        </div>
        <div className="admin-head-actions">
          <button type="button" className="admin-secondary" onClick={addItem}>
            Adicionar
          </button>
          <button type="button" className="admin-primary" onClick={() => confirmServices('Alterações dos serviços confirmadas com sucesso.')}>
            Confirmar alterações
          </button>
        </div>
      </div>
      {servicesMessage && <p className="admin-success">{servicesMessage}</p>}
      <div className="admin-service-list">
        {items
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((item) => (
            <article key={item.id} className="admin-form-card">
              <div className="admin-form-grid">
                <label>
                  Nome
                  <input value={item.name} onChange={(event) => updateItem(item.id, 'name', event.target.value)} />
                </label>
                <label>
                  Slug
                  <input value={item.slug} onChange={(event) => updateItem(item.id, 'slug', event.target.value)} />
                </label>
                <label>
                  Ordem
                  <input type="number" value={item.order} onChange={(event) => updateItem(item.id, 'order', Number(event.target.value))} />
                </label>
                <div>
                  <ImagePicker
                    label="Imagem principal"
                    value={item.image}
                    category="Serviços"
                    onChange={(image) => updateItem(item.id, 'image', image)}
                  />
                </div>
                <label className="span-2">
                  Descrição
                  <textarea value={item.description} onChange={(event) => updateItem(item.id, 'description', event.target.value)} />
                </label>
                <div className="span-2">
                  <ImagePicker
                    label="Galeria relacionada"
                    value={item.gallery || []}
                    category="Serviços"
                    multiple
                    onChange={(images) => updateItem(item.id, 'gallery', images)}
                  />
                </div>
                <label>
                  SEO title
                  <input value={item.seoTitle} onChange={(event) => updateItem(item.id, 'seoTitle', event.target.value)} />
                </label>
                <label>
                  SEO description
                  <input value={item.seoDescription} onChange={(event) => updateItem(item.id, 'seoDescription', event.target.value)} />
                </label>
              </div>
              <div className="admin-form-actions">
                <label className="admin-switch">
                  <input
                    type="checkbox"
                    checked={item.published}
                    onChange={(event) => updateItem(item.id, 'published', event.target.checked)}
                  />
                  Publicado
                </label>
                <button type="button" className="admin-danger" onClick={() => setItems(items.filter((service) => service.id !== item.id))}>
                  Excluir
                </button>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}

function MediaAdmin() {
  const [items, setItems, confirmGallery] = useStoredState(getGallery, saveGallery);
  const [content, setContent, confirmContent] = useStoredState(getContent, saveContent);
  const [services, setServices, confirmMediaServices] = useStoredState(getServices, saveServices);
  const [cases, setCases, confirmMediaCases] = useStoredState(() => getCases(true), saveCases);
  const [category, setCategory] = useState('Galeria');
  const [query, setQuery] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [targetByImage, setTargetByImage] = useState({});
  const [usageMessage, setUsageMessage] = useState('');
  const [activeMediaPage, setActiveMediaPage] = useState('Home');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = category === 'Todas' || item.category === category;
      const text = `${item.name} ${item.alt} ${item.category} ${item.type}`.toLowerCase();
      return matchesCategory && text.includes(query.toLowerCase());
    });
  }, [category, items, query]);

  const mediaTargets = useMemo(() => buildMediaTargets({ services, cases }), [services, cases]);

  function updateMedia(id, field, value) {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  function updateContent(field, value) {
    setContent({ ...content, [field]: value });
  }

  function updateServiceImage(serviceId, field, value) {
    setServices(services.map((service) => (service.id === serviceId ? { ...service, [field]: value } : service)));
  }

  function updateCaseImage(caseId, field, value) {
    setCases(cases.map((caseItem) => (caseItem.id === caseId ? { ...caseItem, [field]: value } : caseItem)));
  }

  async function handleFiles(event) {
    const files = Array.from(event.target.files || []);
    const nextItems = [];

    for (const file of files) {
      const error = validateImageFile(file);
      if (error) {
        setUploadError(error);
        event.target.value = '';
        return;
      }
      const dataUrl = await readFileAsDataUrl(file);
      nextItems.push(createMediaItem({ file, dataUrl, category: category === 'Todas' ? 'Outros' : category }));
    }

    setItems([...nextItems, ...items]);
    setUploadError('');
    event.target.value = '';
  }

  function addToList(list, image) {
    const current = imageList(list);
    if (current.some((item) => item.src === image.src)) return current;
    return [...current, image];
  }

  function assignMediaToTarget(image) {
    const target = targetByImage[image.id] || mediaTargets[0]?.value;
    if (!target) return;

    const [scope, idOrField, fieldOrMode] = target.split('|');

    if (scope === 'content') {
      const nextContent =
        fieldOrMode === 'multiple'
          ? { ...content, [idOrField]: addToList(content[idOrField], image) }
          : { ...content, [idOrField]: image };
      setContent(nextContent);
    }

    if (scope === 'service') {
      setServices(
        services.map((service) => {
          if (service.id !== idOrField) return service;
          if (fieldOrMode === 'gallery') return { ...service, gallery: addToList(service.gallery, image) };
          return { ...service, [fieldOrMode]: image };
        }),
      );
    }

    if (scope === 'case') {
      setCases(
        cases.map((caseItem) => {
          if (caseItem.id !== idOrField) return caseItem;
          if (fieldOrMode === 'gallery') return { ...caseItem, gallery: addToList(caseItem.gallery, image) };
          return { ...caseItem, [fieldOrMode]: image };
        }),
      );
    }

    const label = mediaTargets.find((item) => item.value === target)?.label || 'seção selecionada';
    setUsageMessage(`Imagem vinculada em: ${label}`);
    window.setTimeout(() => setUsageMessage(''), 3000);
  }

  function removeMediaFromTarget(image, target, label) {
    const src = imageSrc(image);
    const [scope, idOrField, fieldOrMode] = target.split('|');

    if (scope === 'content') {
      const nextValue =
        fieldOrMode === 'multiple'
          ? imageList(content[idOrField]).filter((item) => item.src !== src)
          : null;
      setContent({ ...content, [idOrField]: nextValue });
    }

    if (scope === 'service') {
      setServices(
        services.map((service) => {
          if (service.id !== idOrField) return service;
          if (fieldOrMode === 'gallery') {
            return { ...service, gallery: imageList(service.gallery).filter((item) => item.src !== src) };
          }
          return { ...service, [fieldOrMode]: null };
        }),
      );
    }

    if (scope === 'case') {
      setCases(
        cases.map((caseItem) => {
          if (caseItem.id !== idOrField) return caseItem;
          if (fieldOrMode === 'gallery') {
            return { ...caseItem, gallery: imageList(caseItem.gallery).filter((item) => item.src !== src) };
          }
          return { ...caseItem, [fieldOrMode]: null };
        }),
      );
    }

    setUsageMessage(`Imagem removida de: ${label}`);
    window.setTimeout(() => setUsageMessage(''), 3000);
  }

  return (
    <section className="admin-page">
      <div className="admin-page-head admin-page-head-row">
        <div>
          <p>Mídia</p>
          <h1>Imagens por página do site</h1>
        </div>
        <button
          type="button"
          className="admin-primary"
          onClick={() => {
            confirmGallery();
            confirmContent();
            confirmMediaServices();
            confirmMediaCases();
            setUsageMessage(`Alterações confirmadas com sucesso na página ${activeMediaPage}.`);
            window.setTimeout(() => setUsageMessage(''), 3000);
          }}
        >
          Confirmar alterações
        </button>
      </div>

      <div className="admin-media-tabs">
        {mediaPageTabs.map((page) => (
          <button
            key={page}
            type="button"
            className={activeMediaPage === page ? 'active' : ''}
            onClick={() => setActiveMediaPage(page)}
          >
            {page}
          </button>
        ))}
      </div>

      {uploadError && <p className="admin-error">Upload bloqueado: {uploadError}</p>}
      {usageMessage && <p className="admin-success">{usageMessage}</p>}

      {activeMediaPage === 'Home' && (
        <div className="admin-media-page-grid">
          <MediaSection page="Home" title="Hero da Home" text="Imagem principal exibida na primeira dobra do site.">
            <RequiredImageField
              label="Imagem principal da Home"
              value={content.homeHeroImage}
              category="Hero"
              onChange={(image) => updateContent('homeHeroImage', image)}
            />
          </MediaSection>
          <MediaSection page="Home" title="Imagens de apoio da Home" text="Fotos usadas nas áreas de apoio e estrutura da página inicial.">
            <RequiredImageField
              label="Imagem Hardox na Home"
              value={content.homeHardoxImage}
              category="Hardox"
              onChange={(image) => updateContent('homeHardoxImage', image)}
            />
            <RequiredImageField
              label="Imagem da estrutura na Home"
              value={content.homeStructureImage}
              category="Estrutura"
              onChange={(image) => updateContent('homeStructureImage', image)}
            />
          </MediaSection>
          <MediaSection page="Home" title="Galeria da oficina" text="Fotos em loop na página inicial.">
            <FlexibleGalleryField
              label="Galeria da oficina"
              value={content.homeGalleryImages}
              category="Galeria"
              onChange={(images) => updateContent('homeGalleryImages', images)}
            />
          </MediaSection>
        </div>
      )}

      {activeMediaPage === 'Sobre Nós' && (
        <div className="admin-media-page-grid">
          <MediaSection page="Sobre Nós" title="Banner Sobre Nós" text="Imagem obrigatória da seção institucional.">
            <RequiredImageField
              label="Banner da página Sobre Nós"
              value={content.aboutMainImage}
              category="Sobre"
              onChange={(image) => updateContent('aboutMainImage', image)}
            />
          </MediaSection>
          <MediaSection page="Sobre Nós" title="Imagens da empresa" text="Fotos de equipe e estrutura usadas no conteúdo institucional.">
            <FlexibleGalleryField
              label="Fotos de equipe e estrutura"
              value={[content.aboutTeamImage, content.aboutStructureImage].filter(Boolean)}
              category="Sobre"
              onChange={(images) =>
                setContent({
                  ...content,
                  aboutTeamImage: images[0] || content.aboutTeamImage,
                  aboutStructureImage: images[1] || content.aboutStructureImage,
                })
              }
            />
          </MediaSection>
        </div>
      )}

      {activeMediaPage === 'Hardox' && (
        <div className="admin-media-page-grid">
          <MediaSection page="Hardox" title="Banner Hardox" text="Imagem obrigatória da área Hardox.">
            <RequiredImageField
              label="Banner da página Hardox"
              value={content.hardoxMainImage}
              category="Hardox"
              onChange={(image) => updateContent('hardoxMainImage', image)}
            />
          </MediaSection>
          <MediaSection page="Hardox" title="Galeria Hardox" text="Fotos de peças, chapas e aplicações antidesgaste.">
            <FlexibleGalleryField
              label="Galeria Hardox"
              value={content.hardoxGalleryImages}
              category="Hardox"
              onChange={(images) => updateContent('hardoxGalleryImages', images)}
            />
          </MediaSection>
        </div>
      )}

      {activeMediaPage === 'Serviços' && (
        <div className="admin-media-page-grid">
          <MediaSection page="Serviços" title="Banner Serviços" text="Imagem principal da página de serviços.">
            <RequiredImageField
              label="Banner da página Serviços"
              value={content.servicesBannerImage || content.homeStructureImage}
              category="Serviços"
              onChange={(image) => updateContent('servicesBannerImage', image)}
            />
          </MediaSection>
          {services.map((service) => (
            <MediaSection key={service.id} page="Serviços" title={service.name} text="Imagem principal e galeria relacionada a este serviço.">
              <RequiredImageField
                label={`Imagem principal de ${service.name}`}
                value={service.image}
                category="Serviços"
                onChange={(image) => updateServiceImage(service.id, 'image', image)}
              />
              <FlexibleGalleryField
                label={`Galeria de ${service.name}`}
                value={service.gallery || []}
                category="Serviços"
                onChange={(images) => updateServiceImage(service.id, 'gallery', images)}
              />
            </MediaSection>
          ))}
        </div>
      )}

      {activeMediaPage === 'Cases' && (
        <div className="admin-media-page-grid">
          {cases.map((caseItem) => (
            <MediaSection key={caseItem.id} page="Cases" title={caseItem.title} text="Fotos de antes, depois e galeria técnica do case.">
              <RequiredImageField
                label="Foto antes"
                value={caseItem.before}
                category="Antes e Depois"
                onChange={(image) => updateCaseImage(caseItem.id, 'before', image)}
              />
              <RequiredImageField
                label="Foto depois"
                value={caseItem.after}
                category="Antes e Depois"
                onChange={(image) => updateCaseImage(caseItem.id, 'after', image)}
              />
              <FlexibleGalleryField
                label="Galeria do case"
                value={caseItem.gallery || []}
                category="Cases"
                onChange={(images) => updateCaseImage(caseItem.id, 'gallery', images)}
              />
            </MediaSection>
          ))}
        </div>
      )}

      {activeMediaPage === 'FAQ' && (
        <MediaSection page="FAQ" title="FAQ" text="Esta página ainda não possui imagens próprias. A seção está preparada para futuras fotos ou banners." />
      )}

      {activeMediaPage === 'Contato' && (
        <MediaSection page="Contato" title="Contato" text="A página de contato utiliza mapa e dados da empresa. Não há imagens obrigatórias nesta seção no momento." />
      )}

      {activeMediaPage === 'Biblioteca Geral' && (
        <>
          <div className="admin-upload-card">
            <ImagePlus size={24} />
            <label>
              Categoria
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option>Todas</option>
                {mediaCategories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Buscar
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nome, alt text ou categoria" />
            </label>
            <label className="admin-file-button">
              Upload JPG, PNG ou WEBP
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFiles} />
            </label>
          </div>
          <p className="admin-media-help">Banco geral de arquivos enviados. A edição principal de onde cada imagem aparece fica nas abas por página.</p>
          <div className="admin-gallery-grid">
            {filteredItems.map((item) => {
              const usage = collectMediaUsageDetails(item, { content, services, cases });
              return (
                <figure key={item.id}>
                  <img src={item.src} alt={item.name} />
                  <figcaption>
                    <strong>{item.name}</strong>
                    <label>
                      Nome amigável
                      <input value={item.name} onChange={(event) => updateMedia(item.id, 'name', event.target.value)} />
                    </label>
                    <label>
                      Categoria
                      <select value={item.category} onChange={(event) => updateMedia(item.id, 'category', event.target.value)}>
                        {mediaCategories.map((categoryItem) => (
                          <option key={categoryItem}>{categoryItem}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Alt text
                      <textarea value={item.alt} onChange={(event) => updateMedia(item.id, 'alt', event.target.value)} />
                    </label>
                    <span>{item.size ? `${Math.round(item.size / 1024)}KB` : 'Arquivo do site'} - {new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                    <span className="admin-media-url">{displayMediaUrl(item)}</span>
                    <div className="admin-media-usage">
                      <b>Usada em:</b>
                      {usage.length ? (
                        usage.map((place) => (
                          <span key={place.target}>
                            <em>{place.label}</em>
                            <button type="button" onClick={() => removeMediaFromTarget(item, place.target, place.label)}>
                              Remover
                            </button>
                          </span>
                        ))
                      ) : (
                        <em>Nenhuma seção vinculada</em>
                      )}
                    </div>
                    <button type="button" onClick={() => setItems(items.filter((image) => image.id !== item.id))}>
                      Excluir imagem
                    </button>
                  </figcaption>
                </figure>
              );
            })}
            {!filteredItems.length && <p className="admin-empty">Nenhuma imagem encontrada.</p>}
          </div>
        </>
      )}
    </section>
  );
}

function SettingsAdmin() {
  return (
    <>
      <SimpleRecordAdmin type="content" />
      <SimpleRecordAdmin type="settings" />
    </>
  );
}

function SimpleRecordAdmin({ type }) {
  const config = {
    content: {
      label: 'Conteúdo do site',
      loader: getContent,
      saver: saveContent,
      fields: [
        ['heroTitle', 'Hero'],
        ['heroSubtitle', 'Subtítulo'],
        ['aboutTitle', 'Sobre'],
        ['hardoxTitle', 'Hardox'],
        ['footerText', 'Rodapé'],
      ],
    },
    settings: {
      label: 'Configurações',
      loader: getSettings,
      saver: saveSettings,
      fields: [
        ['phone', 'Telefone'],
        ['whatsapp', 'WhatsApp'],
        ['email', 'Email'],
        ['instagram', 'Instagram'],
        ['facebook', 'Facebook'],
        ['linkedin', 'LinkedIn'],
        ['address', 'Endereço'],
        ['maps', 'Google Maps'],
        ['hours', 'Horário'],
      ],
    },
    seo: {
      label: 'SEO técnico',
      loader: getSeo,
      saver: saveSeo,
      fields: [
        ['title', 'Meta title'],
        ['description', 'Meta description'],
        ['keywords', 'Keywords'],
        ['ogImage', 'Open Graph image'],
      ],
    },
  }[type];

  const [record, setRecord, confirmRecord, recordMessage] = useStoredState(config.loader, config.saver);

  function update(field, value) {
    setRecord({ ...record, [field]: value });
  }

  return (
    <section className="admin-page">
      <div className="admin-page-head">
        <p>{config.label}</p>
        <h1>{config.label}</h1>
      </div>
      <div className="admin-form-card">
        <div className="admin-form-grid">
          {config.fields.map(([field, label]) => (
            <label key={field} className={field === 'description' || field === 'address' ? 'span-2' : ''}>
              {label}
              {field === 'description' || field === 'address' ? (
                <textarea value={record[field] || ''} onChange={(event) => update(field, event.target.value)} />
              ) : (
                <input value={record[field] || ''} onChange={(event) => update(field, event.target.value)} />
              )}
            </label>
          ))}
        </div>
        <div className="admin-form-actions">
          <button type="button" className="admin-primary" onClick={() => confirmRecord(`Alterações confirmadas com sucesso em ${config.label}.`)}>
            Confirmar alterações
          </button>
        </div>
        {recordMessage && (
          <p className="admin-save-note">
            <CheckCircle2 size={17} />
            {recordMessage}
          </p>
        )}
      </div>
    </section>
  );
}

function AdminRoutes() {
  const path = useLocation();
  if (path === '/admin/dashboard') return <Dashboard />;
  if (path === '/admin/leads') return <LeadsAdmin />;
  if (path === '/admin/cases') return <CasesAdmin />;
  if (path === '/admin/services') return <ServicesAdmin />;
  if (path === '/admin/media') return <MediaAdmin />;
  if (path === '/admin/settings') return <SettingsAdmin />;
  if (path === '/admin/seo') return <SimpleRecordAdmin type="seo" />;
  return <Redirect to="/admin/dashboard" />;
}

export function AdminApp() {
  const path = useLocation();
  const session = getSession();
  const aliasTarget = adminAliases[path];

  if (aliasTarget) {
    if (path === '/admin' && session) return <Redirect to="/admin/dashboard" />;
    return <Redirect to={aliasTarget} />;
  }

  if (path === '/admin/login') {
    return session ? <Redirect to="/admin/dashboard" /> : <AdminLogin />;
  }

  if (path === '/admin/recover') {
    return session ? <Redirect to="/admin/dashboard" /> : <AdminLogin mode="recovery" />;
  }

  if (!session) {
    return <Redirect to="/admin/login" />;
  }

  return (
    <AdminLayout session={session}>
      <AdminRoutes />
    </AdminLayout>
  );
}
