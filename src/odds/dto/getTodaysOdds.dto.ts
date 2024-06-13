import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class GetTodaysOddsQueryDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  leagueName: string;
}
