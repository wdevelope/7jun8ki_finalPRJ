import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardResponseDto } from './dto/board-response.dto';
import { Board } from './entities/board.entity';
import { Users } from 'src/users/users.entity';
import { BoardsRepository } from './boards.repository';
import { FindBoardDto } from './dto/find-board.dto';
import { BoardSearchService } from './boards.search.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class BoardsService {
  constructor(
    private boardsRepository: BoardsRepository,
    private readonly boardSearchService: BoardSearchService,
  ) {}

  // 페이지네이션 조회
  async findAndCountWithPagination(
    page: number,
    take: number,
  ): Promise<{ data: BoardResponseDto[]; meta: any }> {
    const [boards, totalCount] =
      await this.boardsRepository.getBoardsWithSortingAndPagination(
        page,
        take,
        {
          'board.created_at': 'DESC',
        },
      );
    const lastPage = Math.ceil(totalCount / take);
    return {
      data: boards,
      meta: { totalCount, lastPage },
    };
  }

  // 조회수 정렬
  async getBoardsOrderByViewCount(
    page: number,
    take: number,
  ): Promise<{ data: BoardResponseDto[]; meta: any }> {
    const [boards, totalCount] =
      await this.boardsRepository.getBoardsWithSortingAndPagination(
        page,
        take,
        {
          'board.viewCount': 'DESC', // DESC로 변경하여 조회수가 많은 게시물부터 내림차순으로 가져옵니다.
        },
      );
    const lastPage = Math.ceil(totalCount / take);
    return {
      data: boards,
      meta: { totalCount, lastPage },
    };
  }

  // 좋아요 정렬
  async getBoardsOrderByLikeCount(
    page: number,
    take: number,
  ): Promise<{ data: BoardResponseDto[]; meta: any }> {
    const [boards, totalCount] =
      await this.boardsRepository.getBoardsWithSortingAndPagination(
        page,
        take,
        {
          'board.likeCount': 'DESC',
        },
      );
    const lastPage = Math.ceil(totalCount / take);
    return {
      data: boards,
      meta: { totalCount, lastPage },
    };
  }

  // 랭커유저 정렬
  async getBoardsOrderByRanker(
    page: number,
    take: number,
  ): Promise<{ data: BoardResponseDto[]; meta: any }> {
    const [boards, totalCount] =
      await this.boardsRepository.getBoardsWithSortingAndPagination(
        page,
        take,
        {
          'board.created_at': 'DESC',
        },
        {
          'user.status': 'ranker',
        },
      );
    const lastPage = Math.ceil(totalCount / take);
    return {
      data: boards,
      meta: { totalCount, lastPage },
    };
  }

  // 보드 유저아이디 찾기
  async getBoardsByUserId(
    page: number,
    findBoardDto: FindBoardDto,
  ): Promise<{ data: Board[]; meta: any }> {
    return this.boardSearchService.searchByTitleAndDescriptionAndNickname(
      page,
      findBoardDto,
    );
  }
  // 게시글 상세 조회
  async findOneWithDetails(boardId: number): Promise<Board> {
    const board = await this.boardsRepository.findOneWith(boardId);
    if (!board) {
      throw new NotFoundException('보드가 존재하지 않습니다.');
    }
    return board;
  }

  async create(createBoardDto: CreateBoardDto, user: Users): Promise<void> {
    try {
      await this.boardsRepository.save(createBoardDto, user);
    } catch (error) {
      throw new BadRequestException('SERVICE_ERROR');
    }
  }

  // @Cron('0 */5 * * * *')
  async indexing(): Promise<void> {
    const updateBoardDto: UpdateBoardDto = new UpdateBoardDto();
    updateBoardDto.is_checked = true;
    const boards: Board[] = await this.boardsRepository.findBy({
      where: { is_checked: false },
    });

    try {
      const boardId = boards.map((board) => board.id);
      await this.boardsRepository.updateChecked(updateBoardDto, boardId);

      await this.boardSearchService.indexData(boards);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('SERVICE_ERROR');
    }
  }

  async update(
    user: Users,
    boardId: number,
    updateBoardDto: UpdateBoardDto,
  ): Promise<void> {
    const existedBoard = await this.boardsRepository.findOne({
      where: { id: boardId, user: { id: user.id } },
    });
    if (!existedBoard) {
      throw new NotFoundException('보드가 존재하지 않습니다.');
    }
    try {
      await this.boardsRepository.update(updateBoardDto, boardId);
    } catch (error) {
      throw new BadRequestException('SERVICE_ERROR');
    }
  }

  async remove(user: Users, boardId: number): Promise<void> {
    const existedBoard = await this.boardsRepository.findOne({
      where: { id: boardId, user: { id: user.id } },
    });
    console.log(existedBoard);
    if (!existedBoard) {
      throw new NotFoundException('보드가 존재하지 않습니다.');
    }
    try {
      await this.boardsRepository.remove(existedBoard);
    } catch (error) {
      throw new BadRequestException('SERVICE_ERROR');
    }
  }
}
