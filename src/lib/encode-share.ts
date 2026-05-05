// URL-safe base64 encoding for shader source.
// Keeps things dependency-free; large payloads are still readable but compact
// enough for typical fragment shaders (a few hundred bytes).

function toBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }

  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(value, 'base64'));
  }

  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function encodeFragment(text: string): string {
  const bytes = new TextEncoder().encode(text);
  return toBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeFragment(encoded: string): string | null {
  try {
    let b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4 !== 0) b64 += '=';
    const bytes = fromBase64(b64);
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

export const SHARE_FRAGMENT_PARAM = 'f';
export const SHARE_VERTEX_PARAM = 'v';

/** Backwards-compatible alias for previously-published share links. */
export const SHARE_PARAM = SHARE_FRAGMENT_PARAM;
