import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Chalk from 'chalk';
import * as express from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ExceptionsFilter } from './common/filter/exceptions-filter';
import { HttpExceptionsFilter } from './common/filter/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { logger } from './common/middleware/logger.middleware';
import { RootConfig } from './config/configurations';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(RootConfig);
  const prefix = config.app.prefix;

  app.setGlobalPrefix(prefix);
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Nest-Admin App')
    .setDescription('Nest-Admin App 接口文档')
    .setVersion('2.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  // 项目依赖当前文档功能，最好不要改变当前地址
  // 生产环境使用 nginx 可以将当前文档地址 屏蔽外部访问
  SwaggerModule.setup(`${prefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Nest-Admin API Docs',
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(logger);
  // 全局验证
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      enableDebugMessages: true, // 开发环境
      disableErrorMessages: false,
    }),
  );
  app.use(helmet());
  // 使用全局拦截器打印出参
  app.useGlobalInterceptors(new TransformInterceptor());
  // 所有异常
  app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionsFilter());
  await app.listen(config.app.port);

  Logger.log(
    Chalk.green(`Nest-Admin 服务启动成功 `),
    `http://localhost:${config.app.port}/`,
  );
}
bootstrap();
