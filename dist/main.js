"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/main.ts
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // フロントが localhost:3000 なら CORS を許可
    app.enableCors({ origin: 'http://localhost:3000' });
    // 任意のポート（例:3001）で待ち受け
    await app.listen(3001);
    console.log('NestJS is running on http://localhost:3001');
}
bootstrap();
