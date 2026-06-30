import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import {
  businessHours,
  contactAddress,
  contactPhones,
  googleBusinessProfileUrl,
  googleMapsEmbedUrl,
  serviceArea,
} from '../data/site.js';
import { useAdminSettings } from '../lib/useAdminContent.js';

export function LocalPresence() {
  const settings = useAdminSettings();
  const phones = [settings.phone, settings.whatsapp].filter(Boolean).join(' / ') || contactPhones;
  const address = settings.address || contactAddress;
  const hours = settings.hours || businessHours;
  const mapsUrl = settings.maps || googleBusinessProfileUrl;

  return (
    <div className="local-presence">
      <div className="local-presence-copy">
        <p className="eyebrow">Presença local</p>
        <h2>Atendemos todo o Brasil</h2>
        <p>
          A TORNOGRAN está localizada em Baixo Guandu - ES e atende demandas industriais de mineração, máquinas pesadas
          e manutenção em diferentes regiões do país.
        </p>

        <div className="local-info-grid">
          <div>
            <Phone size={20} />
            <span>
              <strong>Telefone</strong>
              {phones}
            </span>
          </div>
          <div>
            <MapPin size={20} />
            <span>
              <strong>Endereço</strong>
              {address}
            </span>
          </div>
          <div>
            <Clock size={20} />
            <span>
              <strong>Horário</strong>
              {hours}
            </span>
          </div>
        </div>

        <p className="local-service-area">{serviceArea}</p>

        <a className="primary-button" href={mapsUrl} target="_blank" rel="noreferrer">
          Abrir no Google Maps <ArrowRight size={18} />
        </a>
      </div>

      <div className="local-map-card">
        <iframe
          title="Mapa da TORNOGRAN em Baixo Guandu - ES"
          src={googleMapsEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}
