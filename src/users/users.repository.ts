import { Injectable } from '@nestjs/common';
import { Users } from './users.entity';
import { DataSource, Repository } from 'typeorm';
import { UserCreateDto } from './dto/user.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';

@Injectable()
export class UsersRepository extends Repository<Users> {
  constructor(private readonly dataSource: DataSource) {
    super(Users, dataSource.createEntityManager());
  }

  async findUserByEmail(email: string): Promise<Users | null> {
    const user = await this.findOne({ where: { email } });
    return user;
  }

  async createUser(user: UserCreateDto): Promise<Users> {
    const newUser = this.create(user);
    return await this.save(newUser);
  }

  async findUserByIdWithoutPassword(id: number): Promise<Users | null> {
    const user = await this.findOne({
      where: { id },
      select: ['id', 'email', 'nickname', 'imgUrl'],
    });
    return user;
  }

  async findUserById(id: number): Promise<Users | null> {
    const user = await this.findOne({
      where: { id },
    });
    return user;
  }

  async updateUser(user: Users, data: Partial<UserUpdateDto>): Promise<object> {
    const result = await this.update({ id: user.id }, data);
    return result;
  }

  async deleteUser(id: number): Promise<object> {
    const result = await this.delete({ id: id });
    return result;
  }
}
