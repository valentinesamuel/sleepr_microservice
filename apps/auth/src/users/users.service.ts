import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async create(createUserDTO: CreateUserDto) {
    await this.validateCreateUserDto(createUserDTO);
    return this.usersRepository.create({
      ...createUserDTO,
      password: await bcrypt.hash(createUserDTO.password, 10),
    });
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUserDto.email });
      console.log('EXISTS');
    } catch (err) {
      console.log('NOT FOUND');
      return;
    }
    console.log('NOT PROCESSABLE');
    throw new UnprocessableEntityException('Email Already exists');
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
