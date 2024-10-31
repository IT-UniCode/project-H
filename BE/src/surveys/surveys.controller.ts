import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestService } from 'src/request/request.service';
import { GetSurveyDto } from './dto/get-survey.dto';
import { JwtPayload } from 'src/auth/dto/jwt-payload';
import { AuthGuard } from 'src/guard/user.guard';
import { SurveysService } from './surveys.service';
import { SurveyAnswerCreateDto } from './dto/survey.answer.create.dto';
import { GetSurveyQuery } from './queries/get-survey.query';
import { getQueryParams } from 'src/utils';
import { AnswerGetDto } from './dto/survey.answer.get.dto';

@ApiTags('surveys')
@Controller('surveys')
export class SurveysController {
  constructor(
    private readonly requestService: RequestService,
    private readonly surveyService: SurveysService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Surveys',
    type: GetSurveyDto,
  })
  async vote(
    @Body() body: SurveyAnswerCreateDto,
    @Req() req: { user: JwtPayload },
  ) {
    return this.surveyService.postVote(
      body.surveyId,
      body.answers,
      req.user.id,
    );
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Surveys',
    type: GetSurveyDto,
  })
  async getAll(@Query() query: GetSurveyQuery) {
    const includeVariants = query.includeVariants ? 'populate=variants&' : '';

    const params = getQueryParams(query);
    const path = `/surveys?${includeVariants}${params}`;

    return this.requestService.get(path);
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'Surveys',
    type: GetSurveyDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'ew1da2sss678yd4yhu3lrje2',
  })
  async getById(@Param() params: { id: string }) {
    const path = `/surveys/${params.id}?populate=variants`;

    return this.requestService.get(path);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiResponse({
    type: AnswerGetDto,
  })
  @Get('/answers/:id')
  async getResults(
    @Param() params: { id: string },
    @Req() req: { user: JwtPayload },
  ) {
    const answers = {};
    const ids = params.id.split(',');

    await Promise.all(
      ids.map(async (id) => {
        const ans = await this.requestService.get(
          `/survey-answers?filters[userId][$eq]=${req.user.id}&filters[surveyId][$eq]=${id}`,
        );
        answers[id] = ans.data[0]?.answer || null;
      }),
    );

    return answers;
  }
}
