import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { KnodesService } from './knodes.service';
import { CreateKnodeDto } from './dto/create-knode.dto';
import { UpdateKnodeDto } from './dto/update-knode.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { KNode } from './entities/knode.entity';

@ApiTags('KNodes')
@Controller('knodes')
export class KnodesController {
  constructor(private readonly knodesService: KnodesService) {}

  @Post()
  create(@Body() createKnodeDto: CreateKnodeDto) {
    const knode: KNode = this.createDTOtoEntity(createKnodeDto);
    return this.knodesService.create(knode);
  }

  @Get()
  findAll(): Promise<KNode[]> {
    return this.knodesService.findAll();
  }

  @ApiParam({
    name: '_id',
    example: '654f4b4b949323fa41b1a7fb',
    schema: { type: 'string' },
  })
  @Get(':_id')
  findOne(@Param('_id') _id: string): Promise<KNode | null> {
    return this.knodesService.findOne(_id);
  }

  @Patch(':_id')
  update(
    @Param('_id') _id: string,
    @Body() updateKnodeDto: UpdateKnodeDto,
  ): Promise<KNode> {
    const knode: KNode = this.updateDTOtoEntity(updateKnodeDto);
    return this.knodesService.update(_id, knode);
  }

  @Delete(':_id')
  remove(@Param('_id') _id: string): Promise<number> {
    return this.knodesService.delete(_id);
  }

  /**
   * TODO!
   * @param createKnodeDto
   * @returns KNode.entity
   */
  protected createDTOtoEntity(createKnodeDto: CreateKnodeDto): KNode {
    return createKnodeDto as KNode;
  }

  /**
   * TODO!
   * @param updateKnodeDto
   * @returns KNode.entity
   */
  protected updateDTOtoEntity(updateKnodeDto: UpdateKnodeDto): KNode {
    return updateKnodeDto as KNode;
  }
}
