import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signUp.dto';
import { UpdateRequestDto } from './dto/updateRequest.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async signUp(body: SignUpDto) {
    const { email, password, confirm, nickname, status } = body;
    const isUserExist = await this.usersRepository.findUserByEmail(email);

    if (isUserExist) {
      throw new UnauthorizedException('이미 존재하는 사용자 입니다.');
    }

    if (password !== confirm) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersRepository.createUser({
      email,
      password: hashedPassword,
      nickname,
    });

    return {
      statusCode: 201,
      message: '회원가입 성공',
    };
  }

  async updateUser(id: number, body: Partial<UpdateRequestDto>) {
    const { password, newPassword, nickname } = body;
    const user = await this.usersRepository.findUserById(id);

    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자 입니다.');
    }

    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException('password를 확인해주세요.');
    }

    let hashedPassword: string | undefined;
    if (newPassword) {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    await this.usersRepository.updateUser(user, {
      password: hashedPassword || user.password,
      nickname: nickname || user.nickname,
    });

    return {
      statusCode: 201,
      message: '회원정보 수정 성공',
    };
  }

  async deleteUser(id: number) {
    const user = await this.usersRepository.findUserById(id);

    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자 입니다.');
    }

    await this.usersRepository.deleteUser(id);

    return {
      statusCode: 201,
      message: '회원정보 삭제 성공',
    };
  }
}
