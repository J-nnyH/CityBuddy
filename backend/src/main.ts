import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrls = [
    'http://localhost:4200',
    'http://127.0.0.1:4200',
    process.env.FRONTEND_URL,
  ].filter((url): url is string => Boolean(url));

  app.enableCors({
    origin: frontendUrls,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
