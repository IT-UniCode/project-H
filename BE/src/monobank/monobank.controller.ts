import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MonobankService } from './monobank.service';

@ApiTags('monobank')
@Controller('monobank')
export class MonobankController {
  constructor(private readonly monobankService: MonobankService) {}
}
