import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { InternalServerInterceptor } from 'src/middleware/interceptor';
import { LoginDto } from '../../dto/login.dto';
import { SignUpDto } from '../../dto/signup.dto';
import { AuthService } from '../../services/auth/auth.service';

@Controller('auth')
@UseInterceptors(InternalServerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
}
