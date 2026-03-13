import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { addHours } from 'date-fns';

import {
  DeliveryConfigEntity,
  DeliveryEntity,
  LogEntity,
  UserEntity,
} from '../database/entities';
import { OrdersGateway } from '../gateway/orders.gateway';

import {
  ConfigsDto,
  CreateDeliveryDto,
  DeliveryResult,
  ListDeliveriesQueryDTO,
  ListDeliveriesResult,
  UpdateDeliveryDto,
} from './dto';

import { UserRequest } from '../shared/interfaces';
import { StatusDelivery, UserType } from '../shared/constants/enums.constants';
import { sendNotificationsFor } from 'src/shared/utils/notification.functions';

@Injectable()
export class DeliveryService {
  private readonly configKey = 'default';
  private readonly defaultMotoboysDeliveriesAmount = 2;
  private readonly defaultBlockDeliveries = false;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: MongoRepository<UserEntity>,

    @InjectRepository(DeliveryEntity)
    private readonly deliveryRepository: MongoRepository<DeliveryEntity>,

    @InjectRepository(LogEntity)
    private readonly logRepository: MongoRepository<LogEntity>,

    @InjectRepository(DeliveryConfigEntity)
    private readonly deliveryConfigRepository: MongoRepository<DeliveryConfigEntity>,

    private readonly ordersGateway: OrdersGateway,
  ) {}

  async listDeliveries(
    user: UserRequest,
    queryParams: ListDeliveriesQueryDTO,
  ): Promise<ListDeliveriesResult> {
    const userForRequest = await this.findOneUserById(user.id);

    const skip = (queryParams.page - 1) * queryParams.itemsPerPage;
    const take = queryParams.itemsPerPage;
    const where: any = { isActive: true };

    let deliveries;
    let count;

    if (userForRequest.type === UserType.ADMIN) {
      if (queryParams.status) {
        where['status'] = { $in: queryParams.status.split(',') };
      }
      if (queryParams.establishmentId) {
        where['establishment.id'] = queryParams.establishmentId;
      }
      if (queryParams.motoboyId) {
        where['motoboy.id'] = queryParams.motoboyId;
      }
      if (queryParams.createdBy) {
        where['createdBy'] = queryParams.createdBy;
      }
    }

    if (userForRequest.type === UserType.MOTOBOY) {
      const arrayOnStatus = queryParams.status
        ? queryParams.status.split(',')
        : [];

      if (queryParams.status) {
        where['status'] = { $in: arrayOnStatus };
      }

      if (queryParams.establishmentId) {
        where['establishment.id'] = queryParams.establishmentId;
      }

      if (!arrayOnStatus.includes(StatusDelivery.PENDING)) {
        where['motoboy.id'] = userForRequest.id;
      }
    }

    if (
      userForRequest.type === UserType.SHOPKEEPER ||
      userForRequest.type === UserType.SHOPKEEPERADMIN
    ) {
      where['establishment.id'] = userForRequest.id;

      if (queryParams.status) {
        where['status'] = { $in: queryParams.status.split(',') };
      }

      if (queryParams.motoboyId) {
        where['motoboy.id'] = queryParams.motoboyId;
      }
    }

    if (queryParams.createdIn && queryParams.createdUntil) {
      where['createdAt'] = {
        $gte: new Date(queryParams.createdIn),
        $lt: new Date(queryParams.createdUntil),
      };
    }

    try {
      deliveries = await this.deliveryRepository.find({
        relations: { motoboy: true, establishment: true },
        where,
        skip,
        take,
      });

      count = await this.deliveryRepository.count({ where });
    } catch (error) {
      throw error;
    }

    return ListDeliveriesResult.fromEntities(
      deliveries,
      deliveries.length,
      queryParams.page,
      count,
    );
  }

  async updateDelivery(
    deliveryId: string,
    deliveryData: UpdateDeliveryDto,
    user: UserRequest,
  ) {
    const [userFinded, deliveryFinded, configs] = await Promise.all([
      this.findOneUserById(user.id),
      this.deliveryRepository.findOneByOrFail({ id: deliveryId }),
      this.getConfigsEntity(),
    ]);

    let establishmentFinded;
    let motoboyFinded;
    let changedDelivery: any = {};

    if (userFinded.type === UserType.ADMIN) {
  changedDelivery = { ...deliveryFinded, ...deliveryData };

  if (deliveryData.establishmentId) {
    establishmentFinded = await this.findOneUserById(
      deliveryData.establishmentId,
    );
  }

  if (deliveryData.motoboyId) {
    motoboyFinded = await this.findOneUserById(deliveryData.motoboyId);
  }
}

    if (userFinded.type === UserType.SHOPKEEPER) {
      changedDelivery = { ...deliveryFinded, ...deliveryData };
    }

    if (userFinded.type === UserType.MOTOBOY) {
  const freshDelivery = await this.deliveryRepository.findOneByOrFail({
    id: deliveryId,
  });

  if (
    freshDelivery.motoboy != null &&
    freshDelivery.motoboy.id !== userFinded.id
  ) {
    throw new BadRequestException(
      'Essa entrega acabou de ser atribuída a outro entregador.',
    );
  }

  if (
  freshDelivery.motoboy != null &&
  freshDelivery.motoboy.id != userFinded.id
) {
  throw new BadRequestException(
    'Essa entrega já foi atribuída a outro entregador.',
  );
}

  changedDelivery = { ...freshDelivery, ...deliveryData };

      const isTryingToTakeDelivery =
        deliveryData.motoboyId === userFinded.id &&
        freshDelivery.motoboy?.id !== userFinded.id

     if (
  deliveryData.status === StatusDelivery.ONCOURSE &&
  !deliveryData.motoboyId &&
  !freshDelivery.motoboy?.id
) {
        throw new BadRequestException(
          'É necessário que você selecione a opção de motoboy.',
        );
      }

      if (isTryingToTakeDelivery) {
  const activeDeliveries = await this.deliveryRepository.find({
    where: {
      isActive: true,
    },
  });

  const deliveriesForMotoboy = activeDeliveries.filter((delivery: any) => {
    return (
      delivery?.motoboy?.id === userFinded.id &&
      [
        StatusDelivery.PENDING,
        StatusDelivery.ONCOURSE,
        StatusDelivery.COLLECTED,
      ].includes(delivery.status) &&
      delivery.id !== deliveryFinded.id
    );
  }).length;

  if (deliveriesForMotoboy >= configs.amount) {
    throw new BadRequestException(
      `Você não pode pegar mais do que ${configs.amount} solicitações.`,
    );
  }

  motoboyFinded = userFinded;
} else if (freshDelivery.motoboy?.id === userFinded.id) {
  motoboyFinded = userFinded;
}
    }

    if (establishmentFinded) {
      changedDelivery = {
        ...changedDelivery,
        establishment: establishmentFinded,
      };
    }

    if (motoboyFinded) {
      changedDelivery = {
        ...changedDelivery,
        motoboy: motoboyFinded,
      };
    }

    if (deliveryData.status) {
      const dateForUse = addHours(new Date(), -3);

      if (deliveryData.status === StatusDelivery.ONCOURSE) {
        changedDelivery['onCoursedAt'] = dateForUse;
      } else if (deliveryData.status === StatusDelivery.COLLECTED) {
        changedDelivery['collectedAt'] = dateForUse;
      } else if (deliveryData.status === StatusDelivery.FINISHED) {
        changedDelivery['finishedAt'] = dateForUse;
      }
    }

    let deliveryUpdated;

    try {
      deliveryUpdated = await this.deliveryRepository.save({
        ...changedDelivery,
        updatedAt: addHours(new Date(), -3),
      });
    } catch (error) {
      throw error;
    }

    if (deliveryFinded.establishment?.notification?.subscriptionId) {
      if (
        deliveryData.status &&
        deliveryData.status === StatusDelivery.ONCOURSE
      ) {
        await sendNotificationsFor(
          [deliveryFinded.establishment.notification.subscriptionId],
          `O motoboy ${motoboyFinded?.name} aceitou a entrega do pedido do(a) ${deliveryFinded.clientName} e está a caminho!`,
        );
      } else if (deliveryData.status) {
        await sendNotificationsFor(
          [deliveryFinded.establishment.notification.subscriptionId],
          `Houve uma alteração no status da entrega do pedido do(a) ${deliveryFinded.clientName}`,
        );
      }
    }
    this.ordersGateway.notifyNewOrder(deliveryUpdated);
    return DeliveryResult.fromEntity(deliveryUpdated);
  }

  async createDelivery(
    deliveryData: CreateDeliveryDto,
    user: UserRequest,
  ): Promise<DeliveryResult> {
    const [userFinded, configs] = await Promise.all([
      this.findOneUserById(user.id),
      this.getConfigsEntity(),
    ]);
    let establishment;
    let motoboy = null;
    let onCoursedAt = null;

    const {
      clientName,
      clientPhone,
      status,
      value,
      payment,
      soda,
      observation,
    } = deliveryData;

    let deliveryStatus = status;

    if (configs.blockDeliveries && user.type !== UserType.ADMIN) {
      throw new BadRequestException(
        'Infelizmente as entregas foram encerradas por hoje.',
      );
    }

    if (userFinded.type === UserType.ADMIN && deliveryData.establishmentId) {
      establishment = await this.findOneUserById(deliveryData.establishmentId);
    } else {
      establishment = userFinded;
    }

    if (
      (userFinded.type === UserType.ADMIN ||
        userFinded.type === UserType.SHOPKEEPERADMIN) &&
      deliveryData.motoboyId
    ) {
      motoboy = await this.findOneUserById(deliveryData.motoboyId);
      deliveryStatus = StatusDelivery.ONCOURSE;
      onCoursedAt = addHours(new Date(), -3);
    }

    try {
      const newDelivery = await this.deliveryRepository.save({
        id: uuid(),
        clientName,
        clientPhone,
        status: deliveryStatus,
        establishment,
        motoboy,
        value,
        payment,
        soda,
        observation,
        isActive: true,
        createdBy: user.id,
        onCoursedAt,
        createdAt: addHours(new Date(), -3),
        updatedAt: addHours(new Date(), -3),
      });

      this.ordersGateway.notifyNewOrder(newDelivery);

      const newLog: any = {
        id: uuid(),
        where: 'Criação de um delivery',
        type: 'Log para notificações',
        error: 'Sem erro',
        user: userFinded,
        status: 'Notificação enviada.',
      };

      if (deliveryStatus !== StatusDelivery.ONCOURSE) {
        try {
          await this.sendNotificationsToMotoboys(newDelivery.establishment.name);
        } catch (error) {
          newLog.error = `${error}`;
          newLog.status = 'Notificação não enviada devido ao erro';
          await this.logRepository.save(newLog);
        }
      } else {
        try {
          if (motoboy?.notification?.subscriptionId) {
            await sendNotificationsFor(
              [motoboy.notification.subscriptionId],
              `Você foi atribuído a uma entrega no estabelecimento: ${establishment.name}`,
            );
          }
        } catch (error) {
          newLog.error = `${error}`;
          newLog.status = 'Notificação não enviada devido ao erro';
          await this.logRepository.save(newLog);
        }
      }

      return DeliveryResult.fromEntity(newDelivery);
    } catch (error) {
      throw error;
    }
  }

  async deleteDelivery(deliveryId: string, user: UserRequest) {
    const userFinded = await this.findOneUserById(user.id);
    const deliveryFinded = await this.deliveryRepository.findOneByOrFail({
      id: deliveryId,
    });

    if (
      (userFinded.type === UserType.SHOPKEEPER ||
        userFinded.type === UserType.SHOPKEEPERADMIN) &&
      deliveryFinded.establishment.id != userFinded.id
    ) {
      throw new BadRequestException('Você não é o dono dessa entrega.');
    }

    try {
      await this.deliveryRepository.save({
        ...deliveryFinded,
        isActive: false,
        updatedAt: addHours(new Date(), -3),
      });
    } catch (error) {
      throw error;
    }

    return { status: 200, message: 'Entrega apagada com sucesso!' };
  }

  async findOneUserById(userId: string) {
    return await this.userRepository.findOneBy({ id: userId });
  }

  async findConfigs() {
    const configs = await this.getConfigsEntity();

    return {
      status: 200,
      amount: configs.amount,
      amountDeliveries: configs.amount,
      amountDeliverys: configs.amount,
      blockDeliveries: configs.blockDeliveries,
      blockDeliverys: configs.blockDeliveries,
    };
  }

  async changeConfigs(configs: ConfigsDto) {
    const currentConfigs = await this.getConfigsEntity();

    const nextAmount =
      configs.amountDeliveries !== undefined && configs.amountDeliveries !== null
        ? parseInt(String(configs.amountDeliveries), 10)
        : configs.amountDeliverys !== undefined && configs.amountDeliverys !== null
          ? parseInt(String(configs.amountDeliverys), 10)
        : currentConfigs.amount;

    if (Number.isNaN(nextAmount) || nextAmount < 1) {
      throw new BadRequestException(
        'A quantidade máxima de entregas deve ser um número maior que zero.',
      );
    }

    const nextBlockDeliveries =
      configs.blockDeliveries !== undefined
        ? configs.blockDeliveries === true ||
          configs.blockDeliveries === 'true' ||
          configs.blockDeliveries === '1'
        : configs.blockDeliverys !== undefined
          ? configs.blockDeliverys === true ||
            configs.blockDeliverys === 'true' ||
            configs.blockDeliverys === '1'
          : currentConfigs.blockDeliveries;

    await this.deliveryConfigRepository.save({
      ...currentConfigs,
      amount: nextAmount,
      blockDeliveries: nextBlockDeliveries,
      updatedAt: addHours(new Date(), -3),
    });

    return {
      status: 200,
      message: 'Configurações foram alteradas com sucesso.',
    };
  }

  private async sendNotificationsToMotoboys(establishmentName: string) {
    const where = { type: UserType.MOTOBOY };

    const motoboys = await this.userRepository.find({ where });

    const motoboysNotificationsIds = motoboys
      .map((motoboy: UserEntity) => {
        if (motoboy.notification?.subscriptionId) {
          return motoboy.notification.subscriptionId;
        }
        return null;
      })
      .filter(Boolean);

    await sendNotificationsFor(
      motoboysNotificationsIds,
      `Nova solicitação de entrega no estabelecimento: ${establishmentName}`,
    );
  }

  private async getConfigsEntity(): Promise<DeliveryConfigEntity> {
    const existingConfig = await this.deliveryConfigRepository.findOneBy({
      key: this.configKey,
    });

    if (existingConfig) {
      return existingConfig;
    }

    const now = addHours(new Date(), -3);

    return await this.deliveryConfigRepository.save({
      key: this.configKey,
      amount: this.defaultMotoboysDeliveriesAmount,
      blockDeliveries: this.defaultBlockDeliveries,
      createdAt: now,
      updatedAt: now,
    });
  }
}
