import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { urlencoded, json } from "express";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "node:path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useStaticAssets(join(__dirname, "..", "upload", "avatar"));
  app.use(json({ limit: "100mb" }));
  app.use(
    urlencoded({ extended: true, limit: "100mb", parameterLimit: 100000 })
  );
  await app.listen(process.env.PORT || 3333);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
