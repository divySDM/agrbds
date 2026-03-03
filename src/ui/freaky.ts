// Mathematical Bold Script text converter
// Converts A-Z, a-z to their Unicode Mathematical Bold Script equivalents
// e.g. "Hello Bro" -> "𝓗𝓮𝓵𝓵𝓸 𝓑𝓻𝓸"

// Mathematical Bold Script capitals: U+1D4D0 - U+1D4E9 (A-Z)
// Mathematical Bold Script smalls:   U+1D4EA - U+1D503 (a-z)
// Digits stay as-is (no bold script digits in Unicode)

export function freaky(text: string): string {
  let result = '';
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= 0x41 && code <= 0x5A) {
      // A-Z -> Mathematical Bold Script Capital
      result += String.fromCodePoint(0x1D4D0 + (code - 0x41));
    } else if (code >= 0x61 && code <= 0x7A) {
      // a-z -> Mathematical Bold Script Small
      result += String.fromCodePoint(0x1D4EA + (code - 0x61));
    } else {
      result += char;
    }
  }
  return result;
}
