import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoSpecialChar]',
  standalone: false
})
export class NoSpecialChar {
  // Allowed characters for address fields
  private allowedRegex = /^[a-zA-Z0-9 ,.\-_:;/#()&+']$/;

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const key = event.key;

    // Allow control keys
    if (
      key === 'Backspace' ||
      key === 'Delete' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'Tab' ||
      key === 'Enter'
    ) {
      return;
    }

    // Block invalid characters
    if (!this.allowedRegex.test(key)) {
      event.preventDefault();
    }
  }

  // Prevent invalid paste
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const pastedText = event.clipboardData?.getData('text') || '';
    if (![...pastedText].every(char => this.allowedRegex.test(char))) {
      event.preventDefault();
    }
  }
}
