import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { CommentsModule } from './comments/comments.module';
import { TypeOrmConfig } from 'config/typeorm.config';
import { EmailService } from './users/email/email.service';
import { AppController } from './app.controller';
import { LikesModule } from './likes/likes.module';
import { ViewsModule } from './views/views.module';
import { NoticeboardsModule } from './noticeboards/noticeboards.module';
import { StockModule } from './stock/stock.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import type { ClientOpts } from 'redis';
import { EventsModule } from './events/events.module';
import { UploadModule } from './upload/upload.module';
import { QuizModule } from './quiz/quiz.module';
import { AskboardsModule } from './askboards/askboards.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { ExceptionModule } from './exception/exception.module';
import { SearchModule } from './search/search.module';
import { ChatGateway } from './chat/chat.gateway';
import { NewsModule } from './news/news.module';
import { AlertGateway } from './alert/alert.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    TypeOrmModule.forRoot(TypeOrmConfig),
    CacheModule.register<ClientOpts>({
      isGlobal: true,
      store: redisStore,
      host: process.env.HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.PASSWORD,
    }),
    UsersModule,
    BoardsModule,
    CommentsModule,
    LikesModule,
    ViewsModule,
    NoticeboardsModule,
    StockModule,
    EventsModule,
    UploadModule,
    QuizModule,
    AskboardsModule,
    ExceptionModule,
    SearchModule,
    NewsModule,
  ],
  controllers: [AppController],
  providers: [
    EmailService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    ChatGateway,
    AlertGateway,
  ],
})
export class AppModule {}
