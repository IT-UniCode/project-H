import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { NewsController } from './news/news.controller';
import { NewsModule } from './news/news.module';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesModule } from './categories/categories.module';
import { RequestService } from './request/request.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    NewsModule,
    CategoriesModule,
  ],
  controllers: [AppController, NewsController, CategoriesController],
  providers: [AppService, RequestService],
})
export class AppModule {}
