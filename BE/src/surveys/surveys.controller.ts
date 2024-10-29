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
import { AnswerCreateDto } from 'src/votings/dto/answer.create.dto';
import { AuthGuard } from 'src/guard/user.guard';
import { SurveysService } from './surveys.service';

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
  async vote(@Body() body: AnswerCreateDto, @Req() req: { user: JwtPayload }) {
    const path = `survey-answers`;

    return this.surveyService.postVote(
      body.surveyId,
      body.answers,
      req.user.id,
    );

    // return this.requestService.post(path, {
    //   body: { data: { ...body, userId: req.user.id } },
    // });
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Surveys',
    type: GetSurveyDto,
  })
  async getAll() {
    const path = `surveys`;

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
    const path = `surveys/${params.id}`;

    return this.requestService.get(path);
  }
}
