import { AbstractControl, ValidationErrors } from '@angular/forms';

export class NoSpecialCharValidator {

  static isValid(value: any): boolean {
    if (value === null || value === undefined || value === '') {
      return true;
    }

    // < > { } [ ] | \ ^ ~ ` = " @ $ % *--not allowed

    const regex = /^[a-zA-Z0-9 ,.\-_:;/#()&+'"]*$/;
    return regex.test(value);
  }

  static validate(control: AbstractControl): ValidationErrors | null {
    return NoSpecialCharValidator.isValid(control.value)
      ? null
      : { noSpecialChars: true };
  }
}