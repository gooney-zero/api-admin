import { Injectable } from '@nestjs/common';

import PDFDocument = require('pdfkit');

@Injectable()
export class UploadService {
  imgs2pdfs(path: string): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      });
      doc
        .image(`./resources/${path}`, {
          fit: [500, 400],
          align: 'center',
          valign: 'center',
        })
        .end();

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
    });
  }
}
