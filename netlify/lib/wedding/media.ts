function bytesAt(b: Uint8Array, offset: number, expected: number[]): boolean {
  if (b.length < offset + expected.length) return false;
  return expected.every((v, i) => b[offset + i] === v);
}

function asciiAt(b: Uint8Array, offset: number, text: string): boolean {
  return bytesAt(b, offset, Array.from(text, (c) => c.charCodeAt(0)));
}

const VIDEO_ATOMS = ["ftyp", "moov", "mdat", "wide", "free", "skip", "pnot"];
const HEIC_BRANDS = ["heic", "heix", "hevc", "hevx", "heim", "heis", "mif1", "msf1"];
const AVIF_BRANDS = ["avif", "avis"];

/** True if the ftyp box's major brand or any compatible brand (within the bytes read) is listed. */
function hasBrand(b: Uint8Array, brands: string[]): boolean {
  if (!asciiAt(b, 4, "ftyp")) return false;
  const size = ((b[0] << 24) | (b[1] << 16) | (b[2] << 8) | b[3]) >>> 0;
  const end = Math.min(b.length, size);
  // Major brand at 8..11, minor version at 12..15, compatible brands from 16.
  for (let off = 8; off + 4 <= end; off += off === 8 ? 8 : 4) {
    if (brands.some((br) => asciiAt(b, off, br))) return true;
  }
  return false;
}

function isJpeg(b: Uint8Array): boolean {
  if (!bytesAt(b, 0, [0xff, 0xd8, 0xff]) || b.length < 4) return false;
  const m = b[3];
  return (m >= 0xe0 && m <= 0xef) || m === 0xdb || (m >= 0xc0 && m <= 0xcf) || m === 0xfe;
}

/** A thumbnail must be a whole JPEG: SOI at the start and EOI at the end. */
export function isJpegThumb(b: Uint8Array): boolean {
  return b.length >= 5 && bytesAt(b, 0, [0xff, 0xd8, 0xff]) && b[b.length - 2] === 0xff && b[b.length - 1] === 0xd9;
}

/** True if the leading bytes are plausible for the canonical extension. */
export function matchesMagic(ext: string, b: Uint8Array): boolean {
  switch (ext) {
    case "jpg":
      return isJpeg(b);
    case "png":
      return bytesAt(b, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case "gif":
      return asciiAt(b, 0, "GIF87a") || asciiAt(b, 0, "GIF89a");
    case "webp":
      return asciiAt(b, 0, "RIFF") && asciiAt(b, 8, "WEBP");
    case "heic":
    case "heif":
      return hasBrand(b, HEIC_BRANDS);
    case "avif":
      return hasBrand(b, AVIF_BRANDS);
    case "mp4":
    case "m4v":
    case "mov":
    case "3gp":
      return VIDEO_ATOMS.some((atom) => asciiAt(b, 4, atom));
    case "webm":
      return bytesAt(b, 0, [0x1a, 0x45, 0xdf, 0xa3]);
    case "dng":
      return bytesAt(b, 0, [0x49, 0x49, 0x2a, 0x00]) || bytesAt(b, 0, [0x4d, 0x4d, 0x00, 0x2a]);
    default:
      return false;
  }
}
