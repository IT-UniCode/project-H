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
    const surveyPath = `surveys/${surveyId}?populate=variants&filters[state][$eq]=active`;
    const newAnswers = [];

    const cachedSurvey = await this.cacheService.get(surveyPath);

    if (!cachedSurvey) {
      const remoteSurvey = await this.requestService.get(surveyPath);
      await this.cacheService.set(surveyPath, remoteSurvey);

      if (!remoteSurvey) {
        throw new BadRequestException(
          `This survey with id ${surveyId} does not exists`,
        );
      }

      answers.map((ans) => {
        const isVariantExist = remoteSurvey.data.variants.find(
          (v) => v.uniqueId === ans,
        );

        if (isVariantExist) {
          newAnswers.push(ans);
        }
      });

      if (newAnswers.length === 0) {
        throw new BadRequestException(
          `No one of this answers (${answers}) doest exists in survey with id ${surveyId}`,
        );
      }
    } else {
      answers.map((ans) => {
        const isVariantExist = cachedSurvey.data.variants.find(
          (v) => v.uniqueId === ans,
        );

        if (isVariantExist) {
          newAnswers.push(ans);
        }
      });

      if (newAnswers.length === 0) {
        throw new BadRequestException(
          `No one of this answers (${answers}) doest exists in survey with id ${surveyId}`,
        );
      }
    }

    const answersPath = `survey-answers?filters[userId][$eq]=${userId}&filters[surveyId][$eq]=${surveyId}`;

    const cachedAnswers = await this.cacheService.get(answersPath);

    if (!cachedAnswers) {
      const remoteAnswers = await this.requestService.get(answersPath);

      await this.cacheService.set(answersPath, remoteAnswers);

      if (remoteAnswers.data.length > 0) {
        throw new BadRequestException(
          `This user's answer already exists on survey with id ${surveyId}`,
        );
      }
    } else {
      if (cachedAnswers.data.length > 0) {
        throw new BadRequestException(
          `This user's answer already exists on survey with id ${surveyId}`,
        );
      }
    }

    return this.requestService.post(`survey-answers`, {
      body: { data: { userId, surveyId, answers: JSON.stringify(newAnswers) } },
    });
  }
}
