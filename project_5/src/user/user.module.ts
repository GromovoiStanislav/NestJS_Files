import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./guards/jwt.strategy";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: "3600s" }
      })
    }),
    TypeOrmModule.forFeature([UserEntity])
  ],
  providers: [UserService, AuthService, JwtStrategy],
  controllers: [UserController, AuthController]
})
export class UserModule {
}
