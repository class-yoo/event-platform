import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PointRepository } from './repository/point.repository.interface';
import { PointType } from '@shared/enums/point-type.enum';
import { PointStatus } from '@shared/enums/point-status.enum';
import { PointModel } from './models/point.model';
import { ClientSession } from 'mongoose';

@Injectable()
export class PointService {
  constructor(
    @Inject('PointRepository')
    private readonly pointRepo: PointRepository,
  ) {}

  async addPoint(
    data: {
      userId: string;
      amount: number;
      type: PointType;
      status: PointStatus;
      note?: string;
    },
    session?: ClientSession,
  ): Promise<PointModel> {
    if (data.amount <= 0) {
      throw new BadRequestException('적립 금액은 0보다 커야 합니다.');
    }

    return await this.pointRepo.create(
      {
        ...data,
      },
      session,
    );
  }
}
