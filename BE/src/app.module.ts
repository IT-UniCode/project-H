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
import { CommentsController } from './comments/comments.controller';
import { CommentService } from './comments/comments.service';
import { VotingsModule } from './votings/votings.module';
import { VotingsController } from './votings/votings.controller';
import { SurveysModule } from './surveys/surveys.module';
import { VotingsPostService } from './votings/votings.post.service';
import { ForumsModule } from './forums/forums.module';
import { PaymentModule } from './payment/payment.module';
import { FundraisingsModule } from './fundraisings/fundraisings.module';
import { FundraisingCategoriesModule } from './fundraising-categories/fundraising-categories.module';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    NewsModule,
    CategoriesModule,
    VotingsModule,
    SurveysModule,
    ForumsModule,
    CacheModule,
    PaymentModule,
    FundraisingsModule,
    FundraisingCategoriesModule,
    ChatModule,
  ],
  controllers: [
    AppController,
    NewsController,
    CategoriesController,
    CommentsController,
    VotingsController,
  ],
  providers: [
    AppService,
    RequestService,
    CacheService,
    CommentService,
    VotingsPostService,
    ChatGateway,
  ],
})
export class AppModule {}
