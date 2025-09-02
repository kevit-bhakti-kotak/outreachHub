import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })); //jwt-whitelist
  const logger = new Logger('Bootstrap');
  logger.log('Application starting...');

  app.enableCors({
    origin: 'http://localhost:4200', // Angular dev server
    credentials: true,
  });


  await app.listen(2000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
