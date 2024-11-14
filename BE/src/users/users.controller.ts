import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guard/user.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';
import { JwtPayload } from 'src/auth/dto/jwt-payload';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(public userService: UsersService) {}

  @ApiResponse({
    status: 200,
    description: 'User',
    type: User,
  })
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('/search')
  async getUser(@Query('q') q: string, @Req() req: { user: JwtPayload }) {
    return this.userService.search(q, req.user.id);
  }
}
