import { ArrowLeft, MessageCircle } from 'lucide-react';
import { Link } from '../components/Router.jsx';
import { whatsappUrl } from '../data/site.js';
import { trackWhatsAppClick } from '../lib/analytics.js';

export function NotFound() {
  return (
    <section className="not-found-section">
      <div className="mx-auto grid min-h-[68vh] max-w-7xl items-center gap-8 px-5 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="eyebrow">Erro 404</p>
          <h1 className="mt-4 text-4xl font-black uppercase leading-tight md:text-6xl">Página não encontrada</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#62747b]">
            O endereço acessado não existe ou foi movido. Você pode voltar para a página inicial ou falar com a
            TORNOGRAN para solicitar atendimento.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link path="/" className="primary-button">
              <ArrowLeft size={18} />
              Voltar ao início
            </Link>
            <a
              className="secondary-button not-found-whatsapp"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackWhatsAppClick('not_found')}
            >
              <MessageCircle size={18} />
              Falar no WhatsApp
            </a>
          </div>
        </div>
        <div className="not-found-panel">
          <span>404</span>
          <strong>Operação fora da rota</strong>
          <p>Use o menu para navegar por serviços, Hardox, sobre a empresa ou contato.</p>
        </div>
      </div>
    </section>
  );
}
