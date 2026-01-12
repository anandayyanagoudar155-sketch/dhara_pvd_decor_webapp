import { Directive, HostListener, ElementRef } from '@angular/core';


@Directive({
  selector: '[appTwoDecimalInput]',
  standalone: false
})
export class TwoDecimalInput {

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = this.el.nativeElement;
    const key = event.key;
    const value = input.value;

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

    // Allow numbers
    if (/^\d$/.test(key)) {
      // If decimal exists, limit digits after dot
      if (value.includes('.')) {
        const decimals = value.split('.')[1];
        const cursorPos = input.selectionStart ?? value.length;

        if (
          cursorPos > value.indexOf('.') &&
          decimals.length >= 2
        ) {
          event.preventDefault();
        }
      }
      return;
    }

    // Allow dot only once
    if (key === '.') {
      if (value.includes('.')) {
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

    if (!/^\d+(\.\d{1,2})?$/.test(pasted)) {
      event.preventDefault();
    }
  }
}