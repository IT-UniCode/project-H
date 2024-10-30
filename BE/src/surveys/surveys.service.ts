import { BadRequestException, Injectable } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { RequestService } from 'src/request/request.service';

@Injectable()
export class SurveysService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly requestService: RequestService,
  ) {}

  createAnswers(answers: string[], survey: any, surveyId: string) {
    const newAnswers = [];
    answers.map((ans) => {
      const isVariantExist = survey.data.variants.find(
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

    return newAnswers;
  }

  async verifySurvey(surveyPath: string) {
    const remoteSurvey = await this.requestService.get(surveyPath);
    await this.cacheService.set(surveyPath, remoteSurvey);

    if (!remoteSurvey) {
      return false;
    }

    return remoteSurvey;
  }

  async postVote(surveyId: string, answers: string[], userId: number) {
    const surveyPath = `surveys/${surveyId}?populate=variants&filters[state][$eq]=active`;
    const newAnswers = [];

    const cachedSurvey = await this.cacheService.get(surveyPath);

    if (!cachedSurvey) {
      const survey = await this.verifySurvey(surveyPath);

      if (survey) {
        newAnswers.push(...this.createAnswers(answers, survey, surveyId));
      }
    } else {
      newAnswers.push(...this.createAnswers(answers, cachedSurvey, surveyId));
    }

    const answersPath = `survey-answers?filters[userId][$eq]=${userId}&filters[surveyId][$eq]=${surveyId}`;

    const cachedAnswers = await this.cacheService.get(answersPath);

    if (!cachedAnswers || cachedAnswers.data.length === 0) {
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
