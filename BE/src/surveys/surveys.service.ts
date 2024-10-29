import { BadRequestException, Injectable } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { RequestService } from 'src/request/request.service';

@Injectable()
export class SurveysService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly requestService: RequestService,
  ) {}

  async postVote(surveyId: string, answers: string[], userId: number) {
    const survey = await this.requestService.get(
      `surveys/${surveyId}?populate=variants&filters[state][$eq]=active`,
    );

    if (!survey) {
      throw new BadRequestException(
        `This survey with id ${surveyId} does not exists`,
      );
    }

    const newAnswers = [];

    answers.map((ans) => {
      const isVariantExist = survey.data.variants.find(
        (v) => v.uniqueId === ans,
      );

      if (isVariantExist) {
        newAnswers.push(ans);
      }
    });

    console.log({ data: { answers: newAnswers, userId, surveyId } });

    //
    //     const remoteAnswers = await this.requestService.get(
    //       `survey-answers?filters[userId][$eq]=${userId}&filters[votingId][$eq]=${surveyId}`,
    //     );

    return this.requestService.post(`survey-answers`, {
      body: { data: { userId, surveyId, answers: JSON.stringify(newAnswers) } },
    });
  }
}
