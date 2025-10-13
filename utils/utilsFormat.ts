export const numbersOnlyReplacePattern = /\D/g;

export function formatToNumbersOnly(value: string) {
  return value.replace(numbersOnlyReplacePattern, '');
}

export class ValidateEmail {
  static validate(email: string): boolean {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  }
}

export class FormatNumber {
  static number(number: number, locale: string = 'es-AR'): string {
    const formatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
    return formatter.format(number);
  }
}