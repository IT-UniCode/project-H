import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtPayload } from './dto/jwt-payload';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not exist');
    }

    const systemPass = await this.jwtService.decode(user.password);

    if (pass !== systemPass.sub) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      id: user.id,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(dto: CreateUserDto): Promise<any> {
    const user = await this.userService.findOneByEmail(dto.email);
    if (user) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'User already exist!',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    dto.password = hashedPassword;

    return this.userService.create(dto);
  }
}
