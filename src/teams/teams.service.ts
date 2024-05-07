import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  create(createTeamDto: CreateTeamDto): CreateTeamDto {
    createTeamDto.id = '1233-4444-1211-1111';
    return createTeamDto;
  }

  findAll(): any[] {
    return [`This action returns all teams`];
  }

  findOne(id: number) {
    return `This action returns a #${id} team`;
  }

  update(id: number, updateTeamDto: UpdateTeamDto): UpdateTeamDto {
    return updateTeamDto;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
}
