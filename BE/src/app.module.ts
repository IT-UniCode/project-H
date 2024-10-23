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
import { CacheModule } from './cache/cache.module';
import { CacheService } from './cache/cache.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    NewsModule,
    CategoriesModule,
    CacheModule,
    // CacheModule.register(),
  ],
  controllers: [AppController, NewsController, CategoriesController],
  providers: [AppService, RequestService, CacheService],
})
export class AppModule {}
