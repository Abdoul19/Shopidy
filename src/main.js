import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(LoggerService));
  app.enableCors({
    "origin": "*"
  });
  await app.listen(3000);
}
bootstrap();
