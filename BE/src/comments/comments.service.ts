import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtPayload } from 'src/auth/dto/jwt-payload';
import { PrismaService } from 'src/prisma/prisma.service'; // Ensure PrismaService is set up
import { RequestService } from 'src/request/request.service';
import { ResponseComment } from './dto/response-commnet.dto';
import { CommentsPaginationDto } from './dto/comments.pagination.dto';
import { Pagination } from 'src/types';

@Injectable()
export class CommentService {
  constructor(
    private prisma: PrismaService,
    private readonly requestService: RequestService,
  ) {}

  async createComment(
    content: string,
    documentType: string,
    documentId: string,
    user: JwtPayload,
  ) {
    await this.requestService.get(`${documentType}/${documentId}`);

    return this.prisma.comment.create({
      data: {
        userId: user.id,
        content,
        documentType,
        documentId,
      },
    });
  }

  async getCommentsByEntity(
    documentType: string,
    documentId: string,
    pagination: Pagination,
  ): Promise<CommentsPaginationDto> {
    const total = await this.prisma.comment.count({
      where: {
        documentType,
        documentId,
      },
    });
    const take = pagination.pageSize === -1 ? total : pagination.pageSize;
    const skip = pagination.page * Math.abs(pagination.pageSize);

    const res = await this.prisma.comment.findMany({
      where: {
        documentType,
        documentId,
      },
      skip,
      take,
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data: res,
      meta: {
        pagination: {
          page: pagination.page + 1,
          pageCount: Math.ceil(total / take) || 1,
          pageSize: take,
          total,
        },
      },
    };
  }

  async updateComment(id: number, content: string, auth: JwtPayload) {
    const existingComment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    if (auth.id !== existingComment.userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.comment.update({
      where: { id },
      data: { content },
    });
  }
}
