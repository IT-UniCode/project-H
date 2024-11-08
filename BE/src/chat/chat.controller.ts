import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatService } from './chat.service';
import { JwtPayload } from 'src/auth/dto/jwt-payload';
import { AuthGuard } from 'src/guard/user.guard';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async createChat(
    @Body() body: CreateChatDto,
    @Req() req: { user: JwtPayload },
  ) {
    return this.chatService.create(body, req.user.id);
  }

  @Get()
  async getAllChats() {
    return this.chatService.findAll();
  }

  @ApiParam({
    name: 'id',
    type: Number,
  })
  @Get('/:id')
  async getById(@Param() params: { id: string }) {
    return this.chatService.findOneById(parseInt(params.id));
  }

  @ApiParam({
    name: 'id',
    type: Number,
  })
  @Delete('/:id')
  async deleteChat(@Param() params: { id: string }) {
    return this.chatService.delete(parseInt(params.id));
  }
}
