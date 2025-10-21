import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Group extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  createdBy!: number;

  @Prop({ type: Object, default: {} })
  groupRules?: any;

  @Prop({ type: Array, default: [] })
  users?: number[];

  @Prop({ type: Array, default: [] })
  bookings?: number[];
a
  @Prop({ default: true })
  active!: boolean;

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop()
  updatedAt?: Date;
}

export const GroupSchema = SchemaFactory.createForClass(Group);