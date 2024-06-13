import { IsString, Length } from 'class-validator';

export class GetTodaysOddsQueryDto {
  @IsString()
  @Length(3, 50)
  leagueName: string;
}
