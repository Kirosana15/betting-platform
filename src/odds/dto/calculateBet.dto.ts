import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsUUID } from 'class-validator';

export class CalculateBetQueryDto {
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  homeBets: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  drawBets: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  awayBets: string[];
}
