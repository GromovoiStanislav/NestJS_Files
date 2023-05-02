import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository, UpdateResult  } from "typeorm";
import { from, Observable } from "rxjs";
import { User } from "./user.class";
import { map } from "rxjs/operators";


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) {
  }


  findUserById(id: number): Observable<User> {
    return from(
      this.userRepository.findOneBy({ id })
    ).pipe(
      map((user: User) => {
        if (!user) {
          throw new NotFoundException("User not found");
        }
        //delete user.password;
        return user;
      })
    );
  }

  updateUserImageById(id: number, imagePath: string): Observable<UpdateResult> {
    const user: User = new UserEntity();
    user.id = id;
    user.imagePath = imagePath;
    return from(this.userRepository.update(id, user));
  }

  findImageNameByUserId(id: number): Observable<string> {
    return from(this.userRepository.findOneBy({ id })).pipe(
      map((user: User) => {
        return user.imagePath;
      })
    );
  }


  getMyInfo(id: number) {
    return from(
      this.userRepository.findOneBy({ id })
    ).pipe(
      map((user: User) => {
        if (!user) {
          throw new NotFoundException("User not found");
        }
        //delete user.password;
        return user;
      })
    );
  }
}