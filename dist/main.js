"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const port = process.env.port || 3000;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    await app.listen(port, '0.0.0.0');
    app.useGlobalPipes(new common_1.ValidationPipe());
    common_1.Logger.log(`Listening ${process.env.APP_URL}:${port}`, 'Bootstrap');
}
bootstrap();
//# sourceMappingURL=main.js.map