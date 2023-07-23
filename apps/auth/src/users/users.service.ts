import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async create(createUserDTO: CreateUserDto) {
    return this.usersRepository.create({
      ...createUserDTO,
      password: await bcrypt.hash(createUserDTO.password, 10),
    });
  }

  async validateUser(email: string, password: string) {
    const user = this.usersRepository.findOne({ email });
    const passwordIsValid = bcrypt.compare(password, (await user).password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid');
    }
    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }
}
