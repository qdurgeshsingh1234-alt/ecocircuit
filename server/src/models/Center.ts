import mongoose, { Schema, Document } from 'mongoose';

export interface ICenter extends Document {
  name: string;
  address: string;
  lat: number;
  lng: number;
  categories: string[];
  hours: string;
  phone?: string;
  website?: string;
  type: 'campus-point' | 'recycler' | 'collection-drive';
  isSample: boolean;
}

const CenterSchema = new Schema<ICenter>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    categories: [{ type: String }],
    hours: { type: String, required: true },
    phone: { type: String },
    website: { type: String },
    type: {
      type: String,
      enum: ['campus-point', 'recycler', 'collection-drive'],
      default: 'campus-point',
    },
    isSample: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Center = mongoose.model<ICenter>('Center', CenterSchema);
