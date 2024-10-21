import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guard/user.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(public userService: UsersService) {}

  @ApiResponse({
    status: 200,
    description: 'User',
    type: User,
  })
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
