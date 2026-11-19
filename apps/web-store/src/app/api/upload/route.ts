import { NextResponse } from 'next/server';
import { validateUploadedBuffer } from '../../../lib/upload-security';
import { verifyCsrf } from '../../../lib/security';

export async function POST(request: Request) {
  try {
    // 1. Verify CSRF or origin
    if (!verifyCsrf(request)) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing CSRF token / cross-origin request rejected.' },
        { status: 403 }
      );
    }

    // 2. Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { success: false, message: 'No file provided in form-data payload.' },
        { status: 400 }
      );
    }

    const declaredName = file.name || 'unnamed.bin';
    const declaredMime = file.type || 'application/octet-stream';
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Security validation
    const check = validateUploadedBuffer(buffer, declaredName, declaredMime);
    if (!check.valid) {
      const isSizeError = check.error?.includes('exceeds maximum');
      return NextResponse.json(
        { success: false, message: check.error },
        { status: isSizeError ? 413 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      safeFilename: check.safeFilename,
      mimeType: check.detectedMime,
      sizeBytes: buffer.length,
      message: 'File verified successfully and accepted.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to process file upload.' },
      { status: 500 }
    );
  }
}
