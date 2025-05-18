import { Module } from '@nestjs/common';
import { EventModule } from './event/event.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    EventModule,
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/auth',
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
