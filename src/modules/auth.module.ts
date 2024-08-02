import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth/auth.service';
import { AuthController } from '../controllers/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../middleware/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/user.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
