import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Booking extends Document {
  @Prop({ required: true })
  userId!: number;

  @Prop({ required: true })
  carId!: number;

  @Prop()
  groupId?: number;

  @Prop({ required: true })
  startDate!: Date;

  @Prop({ required: true })
  endDate!: Date;

  @Prop({ required: true })
  status!: string;

  @Prop({ default: true })
  active!: boolean;

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop()
  updatedAt?: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);