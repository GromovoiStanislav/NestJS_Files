import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter, OtherExceptionFilter } from "./http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters( new OtherExceptionFilter(), new HttpExceptionFilter());
  await app.listen(3000);
}

bootstrap();
