import { Injectable, NotFoundException, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './entities/dto/create-user.dto';
import { UserResponseDto } from './entities/dto/user-response.dto';
import { UpdateUserDto } from './entities/dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ){}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(newUser);
    return new UserResponseDto(savedUser);
  }

  async findAll(): Promise<UserResponseDto[]>{
    const users = await this.userRepository.find();
    return users.map(u => new UserResponseDto(u));
  }

  async findOneById(id: number): Promise<UserResponseDto>{
    const user = await this.userRepository.findOneBy({ id });
    if (!user){
        throw new NotFoundException(`No existe usuario con id: ${id}`)
    }
    return new UserResponseDto(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto>{
    const user = await this.userRepository.findOneBy({id});
    if (!user){
        throw new NotFoundException(`No existe usuario con id: ${id}`)
    }
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    return new UserResponseDto(updatedUser);

  }

  async delete(id: number): Promise<void>{
    const user = await this.userRepository.findOneBy({ id });
    if (!user){
        throw new NotFoundException(`No existe usuario con id: ${id}`)
    }
    await this.userRepository.remove(user);
  }
}
