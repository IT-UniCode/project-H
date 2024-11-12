import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatService } from './chat.service';
import { JwtPayload } from 'src/auth/dto/jwt-payload';
import { AuthGuard } from 'src/guard/user.guard';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Chat } from './entity/chat.entity';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiResponse({
    type: Chat,
    status: HttpStatus.CREATED,
  })
  @Post()
  async createChat(
    @Body() body: CreateChatDto,
    @Req() req: { user: JwtPayload },
  ) {
    return this.chatService.create(body, req.user.id);
  }

  @ApiResponse({
    type: [Chat],
  })
  @Get()
  async getAllChats(@Req() req: { user: JwtPayload }) {
    const userId = req.user.id;
    return this.chatService.findAll(userId);
  }

  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    type: Chat,
  })
  @Get('/:id')
  async getById(@Param() params: { id: string }) {
    return this.chatService.findOneById(parseInt(params.id));
  }

  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @Delete('/:id')
  async deleteChat(@Param() params: { id: string }) {
    return this.chatService.delete(parseInt(params.id));
  }
}
