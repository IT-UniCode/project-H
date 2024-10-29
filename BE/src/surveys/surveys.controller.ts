import { Controller, Get, Param } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestService } from 'src/request/request.service';
import { GetSurveyDto } from './dto/get-survey.dto';

@ApiTags('surveys')
@Controller('surveys')
export class SurveysController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Surveys',
    type: GetSurveyDto,
  })
  async getAll() {
    const path = 'surveys';

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
