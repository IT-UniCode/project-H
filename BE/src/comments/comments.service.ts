import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtPayload } from 'src/auth/dto/jwt-payload';
import { PrismaService } from 'src/prisma/prisma.service'; // Ensure PrismaService is set up

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async createComment(
    content: string,
    documentType: string,
    documentId: string,
    userId: number,
  ) {
    return this.prisma.comment.create({
      data: {
        userId,
        content,
        documentType,
        documentId,
      },
    });
  }

  async getCommentsByEntity(documentType: string, documentId: string) {
    return this.prisma.comment.findMany({
      where: {
        documentType,
        documentId,
      },
    });
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
