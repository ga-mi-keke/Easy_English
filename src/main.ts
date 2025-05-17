// src/main.ts
import 'reflect-metadata'; 
import { NestFactory } from '@nestjs/core';
import { AppModule }   from './app.module';

async function bootstrap() {
    console.log('→ DATABASE_URL =', process.env.DATABASE_URL);
  const app = await NestFactory.create(AppModule);
  // フロントが localhost:3000 なら CORS を許可
  app.enableCors({ origin: 'http://localhost:3000' });
  // 任意のポート（例:3001）で待ち受け
  await app.listen(3001);
  console.log('NestJS is running on http://localhost:3001');
}

bootstrap();
