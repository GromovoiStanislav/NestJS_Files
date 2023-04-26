import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "node:path";


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "uploads"),
      serveRoot: "/static"
    })],
  controllers: [FilesController],
  providers: [FilesService]
})
export class FilesModule implements OnModuleInit {
  private readonly logger;

  constructor() {
    this.logger = new Logger(FilesModule.name);
  }

  onModuleInit(): any {
    this.logger.log("FilesModule init");
  }
}