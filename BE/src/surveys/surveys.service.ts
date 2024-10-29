import { BadRequestException, Injectable } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { RequestService } from 'src/request/request.service';

@Injectable()
export class SurveysService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly requestService: RequestService,
  ) {}

  async postVote(surveyId: string) {
    const survey = await this.requestService.get(
      `surveys/${surveyId}?filters[state][$eq]=active`,
    );

    return survey;
  }
}
