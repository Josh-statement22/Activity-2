import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './user.schema';
import { UsersController } from './users.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // <<--- important: export so other modules (auth) can import it
})
export class UsersModule {}
