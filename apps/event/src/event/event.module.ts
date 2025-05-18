// src/event/event.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventService } from './event.service';
import { EventMongoRepository } from './repository/event-mongo.repository';
import { EventSchema } from './entities/event.schema';
import { EventController } from './event.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  providers: [
    EventService,
    { provide: 'EventRepository', useClass: EventMongoRepository },
  ],
  controllers: [EventController],
})
export class EventModule {}
