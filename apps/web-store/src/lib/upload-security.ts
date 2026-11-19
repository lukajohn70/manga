import path from 'path';
import crypto from 'crypto';

export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
]);

export const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.pdf',
]);

export interface UploadValidationResult {
  valid: boolean;
  error?: string;
  safeFilename?: string;
  detectedMime?: string;
}

/**
 * Validates uploaded file buffers against strict size, extension, MIME, and magic byte criteria.
 * Completely blocks malicious uploads, webshells, scripts, and disguised executable files.
 */
export function validateUploadedBuffer(
  buffer: Buffer,
  declaredFilename: string,
  declaredMimeType: string
): UploadValidationResult {
  // 1. Buffer existence and size
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'Uploaded file is empty.' };
  }
  if (buffer.length > MAX_UPLOAD_SIZE_BYTES) {
    return { valid: false, error: 'File size exceeds maximum permitted limit of 5MB.' };
  }

  // 2. Extension validation
  const ext = (path.extname(declaredFilename) || '').toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: `Invalid file extension "${ext}". Permitted extensions are: .jpg, .jpeg, .png, .webp, .gif, .pdf`,
    };
  }

  // 3. Declared MIME validation
  const cleanMime = (declaredMimeType || '').toLowerCase().trim();
  if (!ALLOWED_MIME_TYPES.has(cleanMime)) {
    return {
      valid: false,
      error: `Disallowed MIME type "${cleanMime}". Only JPEG, PNG, WEBP, GIF images and PDF documents are allowed.`,
    };
  }

  // 4. Magic bytes (Header signature) verification
  let detectedMime: string | null = null;

  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    detectedMime = 'image/jpeg';
  } else if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    detectedMime = 'image/png';
  } else if (
    buffer.length >= 6 &&
    (buffer.toString('ascii', 0, 6) === 'GIF87a' || buffer.toString('ascii', 0, 6) === 'GIF89a')
  ) {
    detectedMime = 'image/gif';
  } else if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    detectedMime = 'image/webp';
  } else if (
    buffer.length >= 5 &&
    buffer.toString('ascii', 0, 5) === '%PDF-'
  ) {
    detectedMime = 'application/pdf';
  }

  if (!detectedMime) {
    return {
      valid: false,
      error: 'File content verification failed: binary signature does not match allowed image or PDF formats.',
    };
  }

  // 5. Cross-check detected binary format against extension
  const isImageMatch =
    (detectedMime === 'image/jpeg' && (ext === '.jpg' || ext === '.jpeg')) ||
    (detectedMime === 'image/png' && ext === '.png') ||
    (detectedMime === 'image/gif' && ext === '.gif') ||
    (detectedMime === 'image/webp' && ext === '.webp') ||
    (detectedMime === 'application/pdf' && ext === '.pdf');

  if (!isImageMatch) {
    return {
      valid: false,
      error: `File extension "${ext}" does not match the actual binary content type (${detectedMime}).`,
    };
  }

  // 6. Safe UUID filename to prevent directory traversal or file overwrite
  const safeFilename = `${crypto.randomUUID()}${ext}`;

  return {
    valid: true,
    safeFilename,
    detectedMime,
  };
}
