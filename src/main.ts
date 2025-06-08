import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { TimeInterceptor } from './common/interceptors/time.interceptor';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { middleware as superTokensMiddleware } from 'supertokens-node/framework/express';
import supertokens from 'supertokens-node';
import { SuperTokensExceptionFilter } from 'supertokens-nestjs';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.useGlobalInterceptors(app.get(TimeInterceptor));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.setViewEngine('hbs');
  app.use(superTokensMiddleware());
  app.useGlobalFilters(new SuperTokensExceptionFilter());
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
    allowedHeaders: ['Content-Type', ...supertokens.getAllCORSHeaders()],
  });

  const config = new DocumentBuilder()
    .setTitle('HeartBeat Music API')
    .setDescription('OpenAPI спецификация для музыкального сервиса')
    .setVersion('1.0')
    .addTag('Users')
    .addTag('Songs')
    .addTag('Artists')
    .addTag('News')
    .addTag('Collections')
    .addTag('Albums')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
