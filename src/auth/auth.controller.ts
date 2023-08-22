import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './auth.guard';
// import { AuthGuard } from '@nestjs/passport';

@Controller('api/kakao')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login')
  @UseGuards(KakaoAuthGuard)
  async loginKakao() {
    console.log('카카오 로그인 신청');
  }

  @Get('/login/callback')
  @UseGuards(KakaoAuthGuard)
  async callback(@Req() req, @Res() res) {
    const user = req.user;
    const token = await this.authService.generateJWT(user);
    res.cookie('Authorization', `Bearer ${token}`, {
      // httpOnly: true,
      // secure: true, // HTTPS 사용 시 활성화
      // maxAge: 1000 * 60 * 60 * 24 * 7, // 쿠키 유효 기간 설정 (예: 1주일)
    });
    return res.redirect(`http://localhost:3000/view/index.html`);
  }
}
