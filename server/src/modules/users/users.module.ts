import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { BREModule } from '../bre/bre.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), BREModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, MongooseModule], // MongooseModule exported so AuthModule can reuse User model
})
export class UsersModule {}
