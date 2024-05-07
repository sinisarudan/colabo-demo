import { PartialType } from '@nestjs/swagger';
import { CreateKnodeDto } from './create-knode.dto';

export class UpdateKnodeDto extends PartialType(CreateKnodeDto) {}
