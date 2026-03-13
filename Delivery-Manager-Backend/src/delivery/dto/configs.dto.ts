import { IsOptional } from 'class-validator';

export class ConfigsDto {
  @IsOptional()
  amountDeliveries?: string | number;

  @IsOptional()
  amountDeliverys?: string | number;

  @IsOptional()
  blockDeliveries?: string | boolean;

  @IsOptional()
  blockDeliverys?: string | boolean;
}
