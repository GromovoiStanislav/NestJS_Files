import { Module } from "@nestjs/common";
import { FilesModule } from "./files/files.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "node:path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      //rootPath: join( __dirname,'..', 'uploads'),
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot:"/static"
    }),
    FilesModule
  ]
})
export class AppModule {
}
