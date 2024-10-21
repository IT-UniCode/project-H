import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    const systemPass = await this.jwtService.decode(user.password);

    if (pass !== systemPass.sub) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, name: user.name, email: user.email };

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

    const pass = await this.jwtService.signAsync(
      { sub: dto.password },
      {
        expiresIn: '365d',
      },
    );

    dto.password = pass;

    return this.userService.create(dto);
  }
}
