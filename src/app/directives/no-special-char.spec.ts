import { NoSpecialChar } from './no-special-char';

describe('NoSpecialChar', () => {
  it('should create an instance', () => {
    const directive = new NoSpecialChar();
    expect(directive).toBeTruthy();
  });
});
