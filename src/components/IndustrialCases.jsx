import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Images, Target, Wrench, X } from 'lucide-react';
import { industrialCases } from '../data/cases.js';

const caseSteps = [
  { key: 'challenge', label: 'Desafio', icon: Target },
  { key: 'solution', label: 'Solução', icon: Wrench },
  { key: 'result', label: 'Resultado', icon: CheckCircle2 },
];

export function IndustrialCases() {
  const [activeCase, setActiveCase] = useState(null);

  const activeImages = useMemo(() => {
    if (!activeCase) return [];

    return [
      { ...activeCase.before, label: 'Antes' },
      { ...activeCase.after, label: 'Depois' },
      ...activeCase.gallery.map((image) => ({ ...image, label: 'Galeria' })),
    ];
  }, [activeCase]);

  useEffect(() => {
    if (!activeCase) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActiveCase(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeCase]);

  return (
    <>
      <div className="case-stack">
        {industrialCases.map((caseItem, index) => (
          <article key={caseItem.title} className="case-card">
            <div className="case-content">
              <span className="case-number">{String(index + 1).padStart(2, '0')}</span>
              <p className="eyebrow">{caseItem.segment}</p>
              <h3>{caseItem.title}</h3>

              <div className="case-step-grid">
                {caseSteps.map(({ key, label, icon: Icon }) => (
                  <div key={key} className="case-step">
                    <Icon size={20} />
                    <strong>{label}</strong>
                    <p>{caseItem[key]}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="case-media">
              <div className="case-before-after">
                <figure>
                  <img src={caseItem.before.src} alt={caseItem.before.alt} loading="lazy" decoding="async" />
                  <figcaption>Antes</figcaption>
                </figure>
                <figure>
                  <img src={caseItem.after.src} alt={caseItem.after.alt} loading="lazy" decoding="async" />
                  <figcaption>Depois</figcaption>
                </figure>
              </div>

              <button type="button" className="case-gallery-header" onClick={() => setActiveCase(caseItem)}>
                <span>
                  <Images size={17} />
                  Galeria técnica
                </span>
                <ArrowRight size={17} />
              </button>

              <div className="case-gallery">
                {caseItem.gallery.map((image) => (
                  <button key={image.src} type="button" onClick={() => setActiveCase(caseItem)}>
                    <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {activeCase && (
        <div className="case-modal" role="dialog" aria-modal="true" aria-labelledby="case-modal-title">
          <button
            className="case-modal-backdrop"
            type="button"
            aria-label="Fechar galeria"
            onClick={() => setActiveCase(null)}
          />
          <div className="case-modal-panel">
            <div className="case-modal-header">
              <div>
                <p className="eyebrow">{activeCase.segment}</p>
                <h3 id="case-modal-title">{activeCase.title}</h3>
              </div>
              <button type="button" onClick={() => setActiveCase(null)} aria-label="Fechar galeria">
                <X size={22} />
              </button>
            </div>

            <div className="case-modal-gallery">
              {activeImages.map((image) => (
                <figure key={`${image.label}-${image.src}`}>
                  <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
                  <figcaption>{image.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
