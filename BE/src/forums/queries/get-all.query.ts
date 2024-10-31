import { IntersectionType } from '@nestjs/swagger';
import { PaginationQuery, Filters } from 'src/types';

export class GetAllQuery extends IntersectionType(PaginationQuery, Filters) {}
