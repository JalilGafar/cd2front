import { telephoneIncomplet, telephoneInvalide } from './phone-validation.util';

describe('telephoneInvalide', () => {
  it('retourne false si telObj est null ou undefined', () => {
    expect(telephoneInvalide(null)).toBeFalse();
    expect(telephoneInvalide(undefined)).toBeFalse();
  });

  it('retourne false si e164Number est absent', () => {
    expect(telephoneInvalide({})).toBeFalse();
  });

  it('retourne false pour un mobile camerounais plausible (6XXXXXXXX)', () => {
    expect(telephoneInvalide({ e164Number: '+237670000000', countryCode: 'CM' })).toBeFalse();
  });

  it('retourne true pour un numéro camerounais trop court', () => {
    expect(telephoneInvalide({ e164Number: '+23767000', countryCode: 'CM' })).toBeTrue();
  });

  it('retourne true pour une entrée non parseable', () => {
    expect(telephoneInvalide({ e164Number: 'not-a-number', countryCode: 'CM' })).toBeTrue();
  });
});

describe('telephoneIncomplet', () => {
  it('retourne true si telObj est null, undefined ou vide', () => {
    expect(telephoneIncomplet(null)).toBeTrue();
    expect(telephoneIncomplet(undefined)).toBeTrue();
    expect(telephoneIncomplet({})).toBeTrue();
  });

  it("retourne true après un seul chiffre saisi (bug bouton prématurément actif)", () => {
    expect(telephoneIncomplet({ number: '6' })).toBeTrue();
  });

  it('retourne true pour moins de 9 chiffres', () => {
    expect(telephoneIncomplet({ number: '67000' })).toBeTrue();
  });

  it('retourne false pour un numéro de 9 chiffres ou plus', () => {
    expect(telephoneIncomplet({ number: '670000000' })).toBeFalse();
  });

  it('ignore les espaces/tirets de formatage dans le comptage', () => {
    expect(telephoneIncomplet({ number: '6 70 00 00 00' })).toBeFalse();
  });
});
