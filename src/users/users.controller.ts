import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Users } from './users.entity';
import { UserCheckDto } from 'src/auth/dto/user.check.dto';
import { SignUpDto } from './dto/signUp.dto';
import { Response } from 'express';
import { UpdateRequestDto } from './dto/updateRequest.dto';
import { EmailService } from './email/email.service';
import { EmailDto } from './dto/email.dto';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersSevice: UsersService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  // POST. http://localhost:3000/api/users
  @Post()
  async signUp(@Body(ValidationPipe) body: SignUpDto) {
    return await this.usersSevice.signUp(body);
  }

  // POST. http://localhost:3000/api/users/login
  @Post('/login')
  logIn(@Body() body: LoginDto, @Res() res: Response) {
    return this.authService.jwtLogIn(body, res);
  }

  // GET. http://localhost:3000/api/users
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@CurrentUser() user: Users) {
    return user;
  }

  // POST. http://localhost:3000/api/users/check
  @UseGuards(JwtAuthGuard)
  @Post('/check')
  userCheck(@CurrentUser() user: Users, @Body() body: UserCheckDto) {
    return this.authService.userCheck(user.id, body);
  }

  // PATCH. http://localhost:3000/api/users
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateCurrentUser(
    @CurrentUser() user: Users,
    @Body() body: Partial<UpdateRequestDto>,
  ) {
    return await this.usersSevice.updateUser(user.id, body);
  }

  // DELETE. http://localhost:3000/api/users
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteCurrentUser(@CurrentUser() user: Users) {
    return await this.usersSevice.deleteUser(user.id);
  }

  // 이메일 보내는것 까지 성공 http://localhost:3000/api/users/email
  @Post('/email')
  sendTemplate(@Body() body: EmailDto): any {
    return this.emailService.authEmail(body);
  }

  // 이메일 인증 http://localhost:3000/api/users/verifyEmail
  @Post('/verifyEmail')
  async verifyEmail(@Body() body) {
    return this.emailService.verifyEmail(body.email, body.randomCode);
  }
}
