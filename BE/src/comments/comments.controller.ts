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
import { CacheService } from 'src/cache/cache.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comments.service';
import { JwtPayload } from 'src/auth/dto/jwt-payload';
import { AuthGuard } from 'src/guard/user.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsQuery } from './query/query-comments.query';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, type: Number })
  @Post()
  async createComment(@Body() body: CreateCommentDto) {
    return this.commentService.createComment(
      body.content,
      body.documentType,
      body.documentId,
      body.userId,
    );
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: Comment,
  })
  async getComments(@Query() query: CommentsQuery) {
    return this.commentService.getCommentsByEntity(
      query.documentType,
      query.documentId,
    );
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Comment,
  })
  async updateComment(
    @Param('id') id: number,
    @Body() body: UpdateCommentDto,
    @Req() req: { user: JwtPayload },
  ) {
    return this.commentService.updateComment(+id, body.content, req.user);
  }
}
