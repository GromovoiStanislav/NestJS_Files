import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HelperFile } from "src/shared/helper";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {
  }


  async create(createUserDto: CreateUserDto) {
    const createUser = this.userRepository.create(createUserDto);
    return createUser.save();
  }


  async findAll() {
    return this.userRepository.find({
      order: { created_at: "DESC" }
    });

    // return this.userRepository
    //   .createQueryBuilder('user')
    //   .orderBy('created_at', 'DESC')
    //   .getMany();
  }


  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException("user does not exists");
    }
    return user;
  }


  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);

    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException("user does not exists");
    }
    return user;
  }


  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException("user does not exists");
    }

    if (user.avatar !== "" || user.avatar !== null) {
      await HelperFile.removeFile(user.avatar);
    }

    return user.remove();
  }


  async updateAvatar(id: string, file: string, fileName: string) {
    let user: User;
    try {
      user = await this.userRepository.findOneBy({ id });
    }catch (e) {

    }

    if (!user) {
      await HelperFile.removeFile(file);
      throw new NotFoundException("user does not exists");
    }

    if (user.avatar !== "" || user.avatar !== null) {
      await HelperFile.removeFile(user.avatar);
    }

    await this.userRepository.update(id, {
      avatar: file,
      avatar_url: process.env.HOST + "/users/profile-image/" + fileName
    });

    return this.userRepository.findOneBy({ id });
  }
}
