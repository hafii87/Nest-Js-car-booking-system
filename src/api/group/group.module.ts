import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupController } from './group.controller';
import { GroupService } from '../group/group.service';
import { GroupSchema } from './schema/group.schema';

@Module({
  controllers: [GroupController],
  imports: [
    MongooseModule.forFeature([{ name: 'Group', schema: GroupSchema }]),
  ],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}