import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../models/user.entity';
import { SignUpDto } from '../../dto/signup.dto';
import { LoginDto } from '../../dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { sub: user.id, email: user.email };
      return {
        success: true,
        message: 'Login successful.',
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new BadRequestException('Invalid Credentials');
    }
  }

  async signUp(signUpDto: SignUpDto) {
    const { email, password, first_name, last_name } = signUpDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new ConflictException('User Already Exists');
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = this.userRepository.create({
        email,
        password: hashedPassword,
        first_name,
        last_name,
      });
      await this.userRepository.save(newUser);
      return {
        success: true,
        message: 'User registered successfully. Please login.',
      };
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
