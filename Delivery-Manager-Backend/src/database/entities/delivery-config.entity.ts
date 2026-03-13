import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class DeliveryConfigEntity {
  @ObjectIdColumn()
  internalId: ObjectId;

  @Column()
  key: string;

  @Column()
  amount: number;

  @Column()
  blockDeliveries: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
