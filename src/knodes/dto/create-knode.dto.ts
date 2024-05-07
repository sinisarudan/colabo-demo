import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateKnodeDto {
  @ApiProperty({
    example: 'node1',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '{"x": 5}',
    required: false,
  })
  visual?: Record<string, unknown>;

  @ApiProperty({
    example: 1,
    required: false,
  })
  @IsNumber()
  activeVersion?: number;

  @ApiProperty({
    example: 2,
    required: false,
  })
  @IsNumber()
  version?: number;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({
    example: 'rima.user',
    required: false,
  })
  @IsString()
  type?: string;

  @ApiProperty({
    example: '{"address": "Street 1"}',
    required: false,
  })
  dataContent: Record<string, unknown>;

  @ApiProperty({
    example: '654f4b4b949323fa41b1a001',
    required: false,
  })
  @IsString()
  @IsOptional()
  mapId?: string;

  @ApiProperty({
    example: '654f4b4b949323fa41b1a7fb',
    required: false,
  })
  @IsString()
  iAmId?: string;
}
