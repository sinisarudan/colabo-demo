import { PartialType } from '@nestjs/swagger';
import { CreateTeamDto } from './create-team.dto';

/**
 * Team DTO (Data Transfer Object) for input of Update (PUT) method
 */
export class UpdateTeamDto extends PartialType(CreateTeamDto) {}
