import { PointType } from '@shared/enums/point-type.enum';
import { PointStatus } from '@shared/enums/point-status.enum';

export class PointModel {
  id?: string;
  userId: string;
  amount: number;
  type: PointType;
  status: PointStatus;
  note?: string;
}
