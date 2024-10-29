import { IntersectionType } from '@nestjs/swagger';
import { Filters, PaginationQuery } from 'src/types';

export class VotingQuery extends IntersectionType(PaginationQuery, Filters) {}
