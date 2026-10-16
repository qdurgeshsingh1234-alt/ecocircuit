import mongoose, { Schema, Document } from 'mongoose';

export type PickupStatus = 'requested' | 'scheduled' | 'collected';

export interface IPickup extends Document {
  trackingId: string;
  categories: string[];
  quantity: string;
  address: string;
  preferredWindow: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: PickupStatus;
  estimatedImpactKg: number;
  createdAt: Date;
}

const PickupSchema = new Schema<IPickup>(
  {
    trackingId: { type: String, required: true, unique: true },
    categories: [{ type: String, required: true }],
    quantity: { type: String, required: true },
    address: { type: String, required: true },
    preferredWindow: { type: String, required: true },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    status: {
      type: String,
      enum: ['requested', 'scheduled', 'collected'],
      default: 'requested',
    },
    estimatedImpactKg: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Pickup = mongoose.model<IPickup>('Pickup', PickupSchema);
