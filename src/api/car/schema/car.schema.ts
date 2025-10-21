import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Car extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  type!: string;

  @Prop({ required: true })
  brand!: string;

  @Prop({ required: true })
  color!: string;

  @Prop({ default: true })
  active!: boolean;

  @Prop({ type: Object, default: {} })
  carRules?: any;

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop()
  updatedAt?: Date;
}

export const CarSchema = SchemaFactory.createForClass(Car);