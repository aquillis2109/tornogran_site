const analyticsConfig = {
  ga4Id: import.meta.env.VITE_GA4_ID || '',
  gtmId: import.meta.env.VITE_GTM_ID || '',
};

const trackedDownloadExtensions = ['pdf', 'dwg', 'dxf', 'step', 'jpg', 'jpeg', 'png', 'zip'];
let initialized = false;

function canUseDOM() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function appendScript(src) {
  if (!canUseDOM() || document.querySelector(`script[src="${src}"]`)) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

export function pushDataLayer(eventName, params = {}) {
  if (!canUseDOM()) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });
}

export function trackEvent(eventName, params = {}) {
  pushDataLayer(eventName, params);

  if (canUseDOM() && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

export function trackPageView(path, title = document.title) {
  trackEvent('page_view', {
    page_path: path,
    page_title: title,
    page_location: canUseDOM() ? window.location.href : path,
  });
}

export function trackWhatsAppClick(source = 'unknown') {
  trackEvent('click_whatsapp', {
    event_category: 'lead',
    event_label: source,
    contact_channel: 'whatsapp',
  });
}

export function trackQuoteClick(source = 'unknown') {
  trackEvent('click_orcamento', {
    event_category: 'lead',
    event_label: source,
    destination: '/contato',
  });
}

export function trackQuoteFormSubmit(payload = {}) {
  trackEvent('form_orcamento_enviado', {
    event_category: 'lead',
    form_name: 'orcamento_industrial',
    service: payload.service || '',
    has_attachment: Boolean(payload.hasAttachment),
  });
}

export function trackFileDownload(url, source = 'site') {
  trackEvent('file_download', {
    event_category: 'engagement',
    event_label: source,
    file_url: url,
  });
}

function installDownloadTracking() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;

    const href = link.getAttribute('href') || '';
    const cleanHref = href.split('?')[0].split('#')[0];
    const extension = cleanHref.split('.').pop()?.toLowerCase();

    if (link.hasAttribute('download') || trackedDownloadExtensions.includes(extension)) {
      trackFileDownload(href, link.dataset.analyticsSource || 'link');
    }
  });
}

export function initializeAnalytics() {
  if (!canUseDOM() || initialized) return;

  initialized = true;
  window.dataLayer = window.dataLayer || [];

  if (analyticsConfig.gtmId) {
    pushDataLayer('gtm.js', {
      'gtm.start': Date.now(),
    });
    appendScript(`https://www.googletagmanager.com/gtm.js?id=${analyticsConfig.gtmId}`);
  }

  if (analyticsConfig.ga4Id) {
    window.gtag =
      window.gtag ||
      function gtag() {
        window.dataLayer.push(arguments);
      };

    window.gtag('js', new Date());
    window.gtag('config', analyticsConfig.ga4Id, {
      send_page_view: false,
    });
    appendScript(`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.ga4Id}`);
  }

  installDownloadTracking();
}
