import {
  Controller,
  Get,
  Post,
  Query,
  Response,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { editFileName, fileFilter } from '@/utils/file-upload.util';
import { diskStorage } from 'multer';
import { ApiTags } from '@nestjs/swagger';
import { Authorize } from '@/common/decorators/authorize.decorator';
import { Response as ExpressRes } from 'express';

@ApiTags('文件上传')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * 上传图片
   */
  @Post()
  @Authorize()
  @UseInterceptors(
    FilesInterceptor('file', 8, {
      fileFilter,
      storage: diskStorage({
        destination: './resources',
        filename: editFileName,
      }),
    }),
  )
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    return {
      filenames: files.map((file) => ({ filename: file.filename })),
    };
  }

  /**
   * 转PDF
   * @param files
   */
  @Get('/convert')
  @Authorize()
  async imgs2pdfs(@Query('file') file: string, @Response() res: ExpressRes) {
    const buffer = await this.uploadService.imgs2pdfs(file);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=example.pdf',
      'Content-Length': buffer.length,
    });
    res.send(buffer);

    return '';
  }
}
