import { Instagram, Mail, MapPin, MessageCircle, Paperclip, Phone } from 'lucide-react';
import { useState } from 'react';
import { LocalPresence } from '../components/LocalPresence.jsx';
import { PageHero, Section } from '../components/Section.jsx';
import {
  businessHours,
  contactAddress,
  contactEmail,
  contactEmails,
  contactPhone,
  contactPhones,
  contactWhatsapp,
  instagramUrl,
  secondaryEmail,
  whatsappUrl,
} from '../data/site.js';
import { trackQuoteFormSubmit, trackWhatsAppClick } from '../lib/analytics.js';

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = ['pdf', 'dwg', 'dxf', 'step', 'jpg', 'jpeg', 'png'];
const ACCEPTED_FILE_TYPES = '.pdf,.dwg,.dxf,.step,.jpg,.jpeg,.png';
const quoteFormEndpoint =
  import.meta.env.VITE_QUOTE_FORM_ENDPOINT || `https://formsubmit.co/ajax/${contactEmail}`;

const services = [
  'Usinagem pesada',
  'Recuperação de componentes',
  'Manutenção industrial',
  'Soldagem',
  'Fabricação sob demanda',
  'Hardox',
  'Outros',
];

const integrationTargets = {
  email: ['gmail', 'outlook'],
  crm: ['hubspot', 'pipedrive', 'rd-station', 'custom-api'],
};

function getFileValidation(file) {
  if (!file) return '';

  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!ACCEPTED_EXTENSIONS.includes(extension)) {
    return 'Formato inválido. Envie PDF, DWG, DXF, STEP, JPG ou PNG.';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'O arquivo deve ter no máximo 20MB.';
  }

  return '';
}

function buildQuotePayload(form, file) {
  return {
    source: 'site-tornogran',
    submittedAt: new Date().toISOString(),
    integrations: integrationTargets,
    contact: {
      name: form.get('nome'),
      company: form.get('empresa'),
      role: form.get('cargo'),
      phone: form.get('telefone'),
      email: form.get('email'),
      city: form.get('cidade'),
      state: form.get('estado'),
    },
    request: {
      service: form.get('servico'),
      description: form.get('descricao'),
    },
    attachment: file
      ? {
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
        }
      : null,
  };
}

export function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');

  function handleFileChange(event) {
    const file = event.currentTarget.files?.[0];
    const error = getFileValidation(file);
    setFileError(error);
    setFileName(error || !file ? '' : file.name);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSent(false);
    setSubmitError('');

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const file = formElement.arquivo.files?.[0];
    const error = getFileValidation(file);

    if (error) {
      setFileError(error);
      return;
    }

    const payload = buildQuotePayload(form, file);
    window.sessionStorage.setItem('tornogran:lastQuoteRequest', JSON.stringify(payload));

    form.append('_subject', `Novo orçamento pelo site - ${payload.request.service || 'TORNOGRAN'}`);
    form.append('_cc', secondaryEmail);
    form.append('_captcha', 'false');
    form.append('_template', 'table');
    form.append('origem', 'Site Tornogran');

    setSending(true);

    try {
      const response = await fetch(quoteFormEndpoint, {
        method: 'POST',
        body: form,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Falha no envio do formulário.');
      }

      trackQuoteFormSubmit({
        service: payload.request.service,
        hasAttachment: Boolean(file),
      });

      setSent(true);
      formElement.reset();
      setFileName('');
      setFileError('');
    } catch (error) {
      setSubmitError(
        'Não foi possível enviar agora. Tente novamente ou envie direto para contato@tornogran.com.br e ramon.moreira@tornogran.com.br.',
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Contato"
        title="Solicite um orçamento técnico"
        text="Envie dados da empresa, serviço de interesse, descrição da necessidade e arquivos técnicos para análise."
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form className="quote-form" onSubmit={handleSubmit}>
            <label>
              Nome *
              <input type="text" name="nome" placeholder="Seu nome" required autoComplete="name" />
            </label>
            <label>
              Empresa
              <input type="text" name="empresa" placeholder="Nome da empresa" autoComplete="organization" />
            </label>
            <label>
              Cargo
              <input type="text" name="cargo" placeholder="Ex.: comprador, gerente, manutenção" autoComplete="organization-title" />
            </label>
            <label>
              Telefone *
              <input type="tel" name="telefone" placeholder="(00) 00000-0000" required autoComplete="tel" />
            </label>
            <label>
              Email *
              <input type="email" name="email" placeholder="email@empresa.com.br" required autoComplete="email" />
            </label>
            <label>
              Serviço
              <select name="servico" defaultValue="">
                <option value="" disabled>
                  Selecione
                </option>
                {services.map((service) => (
                  <option key={service}>{service}</option>
                ))}
              </select>
            </label>
            <label>
              Cidade
              <input type="text" name="cidade" placeholder="Cidade" autoComplete="address-level2" />
            </label>
            <label>
              Estado
              <input type="text" name="estado" placeholder="UF" maxLength="2" autoComplete="address-level1" />
            </label>
            <label className="md:col-span-2">
              Descreva sua necessidade.
              <textarea
                name="descricao"
                rows="6"
                placeholder="Informe peça, medidas, material, urgência, aplicação, condição atual e qualquer detalhe técnico relevante."
              />
            </label>
            <label className="quote-upload md:col-span-2">
              Arquivos técnicos
              <span>
                <Paperclip size={18} />
                {fileName || 'Anexar PDF, DWG, DXF, STEP, JPG ou PNG até 20MB'}
              </span>
              <input type="file" name="arquivo" accept={ACCEPTED_FILE_TYPES} onChange={handleFileChange} />
            </label>
            {fileError && <p className="quote-error md:col-span-2">{fileError}</p>}
            <button type="submit" className="primary-button md:col-span-2" disabled={sending}>
              {sending ? 'Enviando...' : 'Enviar solicitação'}
            </button>
            {sent && <p className="quote-success md:col-span-2">Solicitação enviada com sucesso.</p>}
            {submitError && <p className="quote-error md:col-span-2">{submitError}</p>}
            <p className="quote-integration-note md:col-span-2">
              As solicitações são enviadas para contato@tornogran.com.br e ramon.moreira@tornogran.com.br.
            </p>
          </form>

          <div className="contact-panel">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="contact-action"
              onClick={() => trackWhatsAppClick('contact_panel')}
            >
              <MessageCircle size={24} />
              <span>
                <strong>WhatsApp</strong>
                {contactWhatsapp}
              </span>
            </a>
            <a href={`tel:${contactPhone.replace(/\D/g, '')}`} className="contact-action">
              <Phone size={24} />
              <span>
                <strong>Telefone</strong>
                {contactPhones}
              </span>
            </a>
            <a href={`mailto:${contactEmail}`} className="contact-action">
              <Mail size={24} />
              <span>
                <strong>E-mail</strong>
                {contactEmails}
              </span>
            </a>
            <div className="contact-action">
              <MapPin size={24} />
              <span>
                <strong>Localização</strong>
                {contactAddress}
              </span>
            </div>
            <a href={instagramUrl} target="_blank" rel="noreferrer" className="contact-action">
              <Instagram size={24} />
              <span>
                <strong>Instagram</strong>
                @tornogran
              </span>
            </a>
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="footer-title">Horário de atendimento</p>
              <p className="mt-3 text-steel">{businessHours}</p>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <LocalPresence />
      </Section>
    </>
  );
}
