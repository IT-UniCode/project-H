import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comments.service';
import { JwtPayload } from 'src/auth/dto/jwt-payload';
import { AuthGuard } from 'src/guard/user.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsQuery } from './query/query-comments.query';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ResponseComment } from './dto/response-commnet.dto';
import { CommentsPaginationDto } from './dto/comments.pagination.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, type: Number })
  @Post()
  async createComment(
    @Body() body: CreateCommentDto,
    @Req() req: { user: JwtPayload },
  ) {
    return this.commentService.createComment(
      body.content,
      body.documentType,
      body.documentId,
      req.user,
    );
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: CommentsPaginationDto,
  })
  async getComments(@Query() query: CommentsQuery) {
    const page = Math.abs(parseInt(query.page || '1'));
    const pageSize = Math.max(parseInt(query.pageSize) || 25, -1);
    return this.commentService.getCommentsByEntity(
      query.documentType,
      query.documentId,
      {
        page: page - 1 < 1 ? 0 : page - 1,
        pageSize: pageSize,
      },
    );
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseComment,
  })
  async updateComment(
    @Param('id') id: string,
    @Body() body: UpdateCommentDto,
    @Req() req: { user: JwtPayload },
  ) {
    return this.commentService.updateComment(
      parseInt(id),
      body.content,
      req.user,
    );
  }
}
