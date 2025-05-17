// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // アプリ起動時に DB 接続
  async onModuleInit() {
    await this.$connect();
  }

    // NestJS がシャットダウンするときに呼ばれる
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
