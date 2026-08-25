import { Injectable } from '@angular/core';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const GOOGLE_ADS_CONVERSION_SEND_TO = 'AW-838821175/UvzpCO6sn-ccELfK_Y8D';
const FALLBACK_DELAY_MS = 300;

// Centralise le tracking de conversion Google Ads pour tous les CTA WhatsApp
// du site. Un seul clic ne doit jamais rester bloqué par un tag Google
// indisponible ou lent : le timeout de secours garantit l'ouverture de
// WhatsApp même si `event_callback` ne se déclenche jamais.
@Injectable({ providedIn: 'root' })
export class WhatsappTrackingService {

  openWhatsapp(whatsappUrl: string, event?: Event): void {
    event?.preventDefault();

    if (typeof window === 'undefined') {
      return;
    }

    if (typeof window.gtag !== 'function') {
      window.open(whatsappUrl, '_blank');
      return;
    }

    let opened = false;
    const open = () => {
      if (opened) return;
      opened = true;
      window.open(whatsappUrl, '_blank');
    };

    window.gtag('event', 'conversion', {
      send_to: GOOGLE_ADS_CONVERSION_SEND_TO,
      value: 1.0,
      currency: 'XAF',
      event_callback: open,
    });

    setTimeout(open, FALLBACK_DELAY_MS);
  }
}
