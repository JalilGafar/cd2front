import { telephoneInvalide } from './phone-validation.util';

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
