import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtPayload } from 'src/auth/dto/jwt-payload';
import { AuthGuard } from 'src/guard/user.guard';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatMsgService } from './chat-msg.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageDto } from './dto/message.dto';
import { GetMessageDto } from './dto/get-message.dto';
import { PaginationQuery } from 'src/types';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('chat')
@Controller('chat')
export class ChatMsgController {
  constructor(private readonly messageService: ChatMsgService) {}

  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @Post('/:id/read')
  async readMsg(@Param('id') id: string, @Req() req: { user: JwtPayload }) {
    return this.messageService.readMsg(parseInt(id), req.user.id);
  }

  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    type: MessageDto,
  })
  @Post('/:id/msg')
  async postMsg(
    @Body() body: CreateMessageDto,
    @Req() req: { user: JwtPayload },
    @Param() params: { id: string },
  ) {
    return this.messageService.create(body, parseInt(params.id), req.user.id);
  }

  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    type: GetMessageDto,
  })
  @Get('/:id/msg')
  async getAllMsg(
    @Param() params: { id: string },
    @Req() req: { user: JwtPayload },
    @Query() query: PaginationQuery,
  ) {
    const page = Math.abs(parseInt(query.page || '1'));
    const pageSize = Math.max(parseInt(query.pageSize) || 25, -1);
    return this.messageService.findAll(parseInt(params.id), req.user.id, {
      page: page - 1 < 1 ? 0 : page - 1,
      pageSize: pageSize,
    });
  }

  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiParam({
    name: 'msgId',
    type: Number,
  })
  @ApiResponse({
    type: MessageDto,
  })
  @Put('/:id/msg/:msgId')
  async editMsg(
    @Param() params: { id: string; msgId: string },

    @Body() body: UpdateMessageDto,
    @Req() req: { user: JwtPayload },
  ) {
    return this.messageService.update(
      parseInt(params.id),
      parseInt(params.msgId),
      req.user.id,
      body,
    );
  }

  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiParam({
    name: 'msgId',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @Delete('/:id/msg/:msgId')
  async deleteMsg(
    @Param() params: { id: string; msgId: string },
    @Req() req: { user: JwtPayload },
  ) {
    return this.messageService.delete(
      parseInt(params.id),
      parseInt(params.msgId),
      req.user.id,
    );
  }
}
