import { AbstractControl, ValidationErrors } from '@angular/forms';

export class TwoDecimalValidator {

  // Two decimals ONLY (allows)
  static isValid(value: any): boolean {
    if (value === null || value === undefined || value === '') {
      return true;
    }
    const regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(value.toString());
  }

  // Two decimals + NON-NEGATIVE
  static isNonNegative(value: any): boolean {
    if (value === null || value === undefined || value === '') {
      return true;
    }

    const num = Number(value);
    if (isNaN(num) || num < 0) {
      return false;
    }

    return TwoDecimalValidator.isValid(value);
  }


  // FORM VALIDATOR (two decimals)
  static validate(control: AbstractControl): ValidationErrors | null {
    return TwoDecimalValidator.isValid(control.value)
      ? null
      : { twoDecimal: true };
  }

  // FORM VALIDATOR (two decimals + non-negative)
  static nonNegative(control: AbstractControl): ValidationErrors | null {
    return TwoDecimalValidator.isNonNegative(control.value)
      ? null
      : { nonNegativeTwoDecimal: true };
  }
}