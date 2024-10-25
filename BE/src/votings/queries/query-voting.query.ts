import { IntersectionType } from "@nestjs/swagger";
import { Pagination, Filters } from "src/types";

export class VotingQuery extends IntersectionType(Pagination, Filters) {}
