import { BadRequestException, Injectable } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { RequestService } from 'src/request/request.service';

@Injectable()
export class VotingsPostService {
  constructor(
    private readonly requestService: RequestService,
    private readonly cacheService: CacheService,
  ) {}

  async post(votingId: string, answer: string, userId: number) {
    const votingPath = `/votings/${votingId}?populate=variants&filters[state][$eq]=active`;
    const answersPath = `/answers?filters[userId][$eq]=${userId}&filters[votingId][$eq]=${votingId}`;

    const cachedVoting = await this.cacheService.get(votingPath);

    if (!cachedVoting) {
      const voting = await this.requestService.get(votingPath);
      await this.cacheService.set(votingPath, voting, 300000); // 5 min

      if (!voting) {
        throw new BadRequestException(
          `This voting with id ${votingId} does not exist`,
        );
      }

      const isVariantExist = voting.data.variants.find(
        (v) => v.uniqueId === answer,
      );

      if (!isVariantExist) {
        throw new BadRequestException(
          `This variant ${answer} does not exist in voting with id ${votingId}`,
        );
      }
    } else {
      const isVariantExist = cachedVoting.data.variants.find(
        (v) => v.uniqueId === answer,
      );

      if (!isVariantExist) {
        throw new BadRequestException(
          `This variant ${answer} does not exist in voting with id ${votingId}`,
        );
      }
    }

    const cachedAnswers = await this.cacheService.get(answersPath);

    if (!cachedAnswers || cachedAnswers.data.length === 0) {
      const answers = await this.requestService.get(answersPath);

      await this.cacheService.set(answersPath, answers, 300000); // 5 min

      if (answers.data.length > 0) {
        throw new BadRequestException(
          `This user's vote already exists on voting with id ${votingId}`,
        );
      }
    } else {
      if (cachedAnswers.data.length > 0) {
        throw new BadRequestException(
          `This user's vote already exists on voting with id ${votingId}`,
        );
      }
    }

    return this.requestService.post(`/answers`, {
      body: { data: { answer, userId, votingId } },
    });
  }
}
