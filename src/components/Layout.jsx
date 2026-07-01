import { Clock, Instagram, Mail, MapPin, Menu, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from './Router.jsx';
import { businessHours, contactAddress, contactEmail, contactPhones, instagramUrl, whatsappUrl } from '../data/site.js';
import { trackQuoteClick, trackWhatsAppClick } from '../lib/analytics.js';
import { useAdminContent, useAdminSettings } from '../lib/useAdminContent.js';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Sobre', path: '/sobre' },
  { label: 'Serviços', path: '/servicos' },
  { label: 'Hardox', path: '/hardox' },
  { label: 'Cases', path: '/cases' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contato', path: '/contato' },
];

export function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const content = useAdminContent();
  const settings = useAdminSettings();
  const phones = [settings.phone, settings.whatsapp].filter(Boolean).join(' / ') || contactPhones;
  const email = settings.email || contactEmail;
  const hours = settings.hours || businessHours;
  const address = settings.address || contactAddress;
  const instagram = settings.instagram || instagramUrl;

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  return (
    <div className="min-h-screen bg-[#f4f7f8] text-[#172529]">
      <header className="fixed inset-x-0 top-0 z-50 bg-[#090f11] text-white shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
        <div className="hidden lg:block">
          <div className="mx-auto flex h-28 max-w-7xl items-center justify-between px-8">
            <Link path="/" aria-label="TORNOGRAN LTDA">
              <img
                src="/assets/tornogran-logo.png"
                alt="TORNOGRAN LTDA"
                width="120"
                height="61"
                className="h-[61px] w-[120px] object-contain"
                decoding="async"
                fetchPriority="high"
              />
            </Link>
            <div className="grid min-w-0 flex-1 grid-cols-4 gap-3 pl-8">
              <TopInfo icon={Phone} label="Ligue" value={phones} />
              <TopInfo icon={Mail} label="E-mail" value={email} />
              <TopInfo icon={MapPin} label="Localização" value="Baixo Guandu - ES" />
              <TopInfo icon={Clock} label="Atendimento" value={hours} />
            </div>
          </div>
        </div>

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between bg-[#090f11] px-5 text-white shadow-xl lg:h-[72px] lg:bg-white lg:px-8 lg:text-[#172529]">
          <Link path="/" className="lg:hidden" aria-label="TORNOGRAN LTDA">
            <img
              src="/assets/tornogran-logo.png"
              alt="TORNOGRAN LTDA"
              width="120"
              height="61"
              className="h-[61px] w-[120px] object-contain"
              decoding="async"
              fetchPriority="high"
            />
          </Link>

          <nav className="hidden items-center lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.path}
                path={item.path}
                className={`nav-link ${location === item.path ? 'nav-link-active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center lg:flex">
            <a className="instagram-button" href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram da TORNOGRAN">
              <Instagram size={20} />
            </a>
            <Link className="primary-button" path="/contato" onClick={() => trackQuoteClick('header')}>
              Orçamento
            </Link>
          </div>

          <button className="icon-button lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Abrir menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="border-t border-[#d8e1e5] bg-white px-5 py-5 text-[#172529] lg:hidden">
            <nav className="mx-auto grid max-w-7xl gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  path={item.path}
                  className={`rounded-sm px-3 py-3 text-sm font-semibold uppercase tracking-[0.18em] ${
                    location === item.path ? 'bg-orange text-graphite' : 'text-[#62747b]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-sm px-3 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#62747b]"
              >
                <Instagram size={18} /> Instagram
              </a>
            </nav>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t border-[#d8e1e5] bg-[#172529] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <p className="text-2xl font-black">TORNOGRAN LTDA</p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#c6d0d4]">
              {content.footerText ||
                'Soluções em usinagem pesada, recuperação de componentes e manutenção industrial para operações que exigem resistência, precisão e resposta técnica.'}
            </p>
          </div>
          <div>
            <p className="footer-title">Atendimento</p>
            <p className="mt-3 text-sm text-[#c6d0d4]">{phones}</p>
            <p className="mt-2 text-sm text-[#c6d0d4]">{email}</p>
          </div>
          <div>
            <p className="footer-title">Horário</p>
            <p className="mt-3 text-sm text-[#c6d0d4]">{hours}</p>
            <p className="mt-2 text-sm text-[#c6d0d4]">{address}</p>
          </div>
        </div>
      </footer>

      <a
        href={whatsappUrl}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center overflow-visible bg-transparent drop-shadow-2xl transition hover:-translate-y-1"
        target="_blank"
        rel="noreferrer"
        aria-label="Contato por WhatsApp"
        onClick={() => trackWhatsAppClick('floating_button')}
      >
        <img
          src="/assets/whatsapp-logo-transparent.png"
          alt=""
          width="56"
          height="56"
          className="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </a>
    </div>
  );
}

function TopInfo({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-3 border-l border-white/20 pl-4">
      <Icon className="shrink-0 text-[#f6c400]" size={26} strokeWidth={2.2} />
      <span className="min-w-0">
        <span className="block text-xs font-black uppercase tracking-[0.08em] text-white">{label}</span>
        <span className="mt-1 block break-words text-xs font-semibold leading-4 text-white/82">{value}</span>
      </span>
    </div>
  );
}
