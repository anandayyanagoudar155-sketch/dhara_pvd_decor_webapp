import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appTwoDecimalNegativeInput]',
  standalone: false
})
export class TwoDecimalNegativeInput {

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = this.el.nativeElement;
    const key = event.key;
    const value = input.value;
    const cursorPos = input.selectionStart ?? 0;

    // Allow control keys
    if (
      key === 'Backspace' ||
      key === 'Delete' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'Tab'
    ) {
      return;
    }

    // Allow minus ONLY at start and only once
    if (key === '-') {
      if (value.includes('-') || cursorPos !== 0) {
        event.preventDefault();
      }
      return;
    }

    // Allow digits
    if (/^\d$/.test(key)) {
      if (value.includes('.')) {
        const dotIndex = value.indexOf('.');
        const decimals = value.split('.')[1] || '';

        if (cursorPos > dotIndex && decimals.length >= 2) {
          event.preventDefault();
        }
      }
      return;
    }

    // Allow dot only once and NOT as first char or right after "-"
    if (key === '.') {
      if (
        value.includes('.') ||
        value === '' ||
        value === '-'
      ) {
        event.preventDefault();
      }
      return;
    }

    // Block everything else
    event.preventDefault();
  }

  // Handle paste
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData('text') || '';

    // Allows: -10, -10.25, 10, 10.5
    if (!/^-?\d+(\.\d{1,2})?$/.test(pasted)) {
      event.preventDefault();
    }
  }
}