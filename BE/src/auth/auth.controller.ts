import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(public authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Login',
  })
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    console.log('Login', signInDto);
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  @ApiResponse({
    status: 200,
    description: 'Sign Up',
    type: User,
  })
  signUp(@Body() signUpDto: CreateUserDto) {
    return this.authService.signUp(signUpDto);
  }
}
