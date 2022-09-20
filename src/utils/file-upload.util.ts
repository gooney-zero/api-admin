import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { extname } from 'path';
import type { DiskStorageOptions } from 'multer';

export const fileFilter: MulterOptions['fileFilter'] = (req, file, cb) => {
  const mimetype = file.mimetype;
  if (!mimetype.match(/jpg|jpeg|gif|png|bmp/i)) {
    return cb(
      new BadRequestException(
        `Only images files are allowed! Bad request. Accepted file extensions are: ${extname(
          file.originalname,
        )}`,
      ),
      false,
    );
  }
  cb(null, true);
};

export const editFileName: DiskStorageOptions['filename'] = (
  req,
  file,
  callback,
) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(10)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};
