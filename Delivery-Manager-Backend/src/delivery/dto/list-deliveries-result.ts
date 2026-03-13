import { Expose, Type } from 'class-transformer';
import { DeliveryEntity } from '../../database/entities';
import { DeliveryResult } from './delivery-result.dto';

export class ListDeliveriesResult {
  @Expose()
  @Type(() => DeliveryResult)
  data: DeliveryResult[];

  @Expose()
  page: number;

  @Expose()
  itemsPerPage: number;

  @Expose()
  count: number;

  static fromEntities(
    deliveries: DeliveryEntity[],
    itemsPerPage,
    page,
    count,
  ): ListDeliveriesResult {
    const data = deliveries.map((delivery) => DeliveryResult.fromEntity(delivery));
    return {
      page,
      itemsPerPage,
      data,
      count,
    };
  }
}
