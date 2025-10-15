import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './entities/dto/create-user.dto';
import { UserResponseDto } from './entities/dto/user-response.dto';
import { UpdateUserDto } from './entities/dto/update-user.dto';
import { PasswordService } from 'src/shared/services/password.service';
import { User } from './entities/user.entity';


@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ){}

    async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
      const savedUser = await this.userRepository.save(createUserDto);
      return new UserResponseDto(savedUser);
    }

    async findAll(): Promise<UserResponseDto[]>{
      const users = await this.userRepository.find();
      return users.map(u => new UserResponseDto(u));
    }

    async findOneById(id: number): Promise<UserResponseDto>{
      const user = await this.findEntityById(id);
      return new UserResponseDto(user);
    }

    async findEntityById(id: number): Promise<User> {
      const user = await this.userRepository.findOne({
        where: {id},
        relations: ['hotel']
      });
      if (!user) {
          throw new NotFoundException(`No existe usuario con id: ${id}`);
      }
      return user;
    }

    async findOneByEmail(email: string): Promise<User | null>{
      return await this.userRepository.findOneBy({ email });
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto>{
      const user = await this.findEntityById(id);
      Object.assign(user, updateUserDto);
      const updatedUser = await this.userRepository.save(user);
      return new UserResponseDto(updatedUser);

    }

    async delete(id: number): Promise<void>{
      const user = await this.findEntityById(id);
      await this.userRepository.remove(user);
    }

}
