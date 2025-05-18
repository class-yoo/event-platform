// src/event/repository/event-mongo.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from '../dto/create-event.dto';
import { EventRepository } from './event.repository.interface';
import { EventModel } from '../models/event.model';
import { EventDocument } from '../entities/event.schema';

@Injectable()
export class EventMongoRepository implements EventRepository {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
  ) {}

  private toModel(doc: EventDocument): EventModel {
    return {
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      type: doc.type,
      target: doc.target,
      startAt: doc.startAt,
      endAt: doc.endAt,
      active: doc.active,
      createdBy: doc.createdBy,
    };
  }

  async create(
    data: CreateEventDto & { createdBy: string },
  ): Promise<EventModel> {
    const created = await this.eventModel.create({
      ...data,
    });
    return this.toModel(created);
  }

  async findAllActive(): Promise<EventModel[]> {
    const docs = await this.eventModel.find({ active: true }).exec();
    return docs.map((doc) => this.toModel(doc));
  }

  async findById(id: string): Promise<EventModel | null> {
    const doc = await this.eventModel.findById(id).exec();
    return doc ? this.toModel(doc) : null;
  }
}
