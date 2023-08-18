import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Board } from 'src/boards/entities/board.entity';
import { Comment } from './entities/comment.entity';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Users } from 'src/users/users.entity';
@UseGuards(JwtAuthGuard)
@Controller('boards')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/:boardId')
  create(
    @CurrentUser() user: Users,
    @Param('boardId') boardId: Board,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(user, createCommentDto, boardId);
  }

  @Get('/:boardId')
  findAllByBoard(@Param('boardId') boardId: number): Promise<Comment[]> {
    return this.commentsService.findAllByBoard(boardId);
  }

  @Patch('/:boardId/comments/:commentId')
  update(
    @CurrentUser() user: Users,
    @Param('boardId') boardId: number,
    @Param('commentId') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(
      user,
      boardId,
      commentId,
      updateCommentDto,
    );
  }

  @Delete('/:boardId/comments/:commentId')
  remove(
    @CurrentUser() user: Users,
    @Param('boardId') boardId: number,
    @Param('commentId') commentId: number,
  ) {
    return this.commentsService.remove(user, boardId, commentId);
  }
}
