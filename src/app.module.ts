import { Module } from "@nestjs/common";
import { FilesModule } from "./files/files.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "node:path";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      //rootPath: join( __dirname,'..', 'uploads'),
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot:"/static"
    }),
    // MulterModule.register({
    //   dest: join(process.cwd(), 'uploads'),
    // }),
    FilesModule
  ]
})
export class AppModule {
}
