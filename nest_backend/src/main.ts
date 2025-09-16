import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,       // strips extra properties automatically
    forbidNonWhitelisted: false, // don’t throw 400 for extra props
    transform: true,       // optional, auto-converts types
  }),
);
  const logger = new Logger('Bootstrap');
  logger.log('Application starting...');

   app.enableCors({
    origin: 'http://localhost:4200', // or your frontend domain
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Workspace-Id', // ✅ important
    ],
  });


  await app.listen(2000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
