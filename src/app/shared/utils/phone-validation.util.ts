import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

export interface TelephoneIntl {
  e164Number?: string;
  countryCode?: string;
}

// Les métadonnées embarquées dans google-libphonenumber (dépendance de
// ngx-intl-tel-input) ne couvrent pas encore les tranches mobiles 63X/64X
// attribuées par l'ART au Cameroun : isValidNumber() les rejette à tort.
// On retombe sur un contrôle de forme (9 chiffres, préfixe fixe "2" ou
// mobile "6") plutôt que sur la liste d'opérateurs figée de la lib.
function numeroCamerounaisPlausible(nationalNumber: string): boolean {
  return /^[26]\d{8}$/.test(nationalNumber);
}

export function telephoneInvalide(telObj: TelephoneIntl | null | undefined): boolean {
  if (!telObj?.e164Number) return false;
  try {
    const parsed = phoneUtil.parse(telObj.e164Number);
    if (phoneUtil.isValidNumber(parsed)) return false;
    if (telObj.countryCode === 'CM') {
      return !numeroCamerounaisPlausible(String(parsed.getNationalNumber()));
    }
    return true;
  } catch {
    return true;
  }
}
