import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    console.log('Looking for user with email:', email);
    const user = await this.usersService.findByEmail(email);
    console.log('Found user:', user);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatches = await bcrypt.compare(password, user.password);
    console.log('Password matches:', passwordMatches);

    if (!passwordMatches)
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(input: LoginInput) {
    const user = await this.validateUser(input.email, input.password);

    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    const { password: _, ...userWithoutPassword } = user;

    return {
      access_token,
      user: userWithoutPassword,
    };
  }
}
