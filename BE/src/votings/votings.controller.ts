import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpStatus,
  Param,
} from "@nestjs/common";
import { RequestService } from "src/request/request.service";
import { CacheService } from "src/cache/cache.service";
import { getQueryParams } from "src/utils";
import { ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Voting } from "./entities/voting.entity";

@ApiTags("votings")
@Controller("votings")
export class VotingsController {
  constructor(
    private readonly requestService: RequestService,
    private readonly cacheService: CacheService,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: "Votings",
    type: Voting,
  })
  async getAll(
    @Query()
    query?: any,
  ) {
    const params = getQueryParams(query, "");
    const path = `votings?${params}`;
    const data = await this.cacheService.get(path);

    if (!data) {
      const data = await this.requestService.get(path);

      this.cacheService.set(path, data);

      return data;
    } else {
      return data;
    }
  }

  @Get("/:id")
  @ApiResponse({
    status: 200,
    description: "Votings",
  })
  @ApiParam({
    name: "id",
    type: String,
    example: "ew1da2sss678yd4yhu3lrje2",
  })
  async getById(
    @Param()
    params: {
      id: string;
    },
  ) {
    const path = `votings/${params.id}`;
    const data = await this.cacheService.get(path);

    if (!data) {
      const data = await this.requestService.get(path);

      this.cacheService.set(path, data);

      return data;
    } else {
      return data;
    }
  }
}
