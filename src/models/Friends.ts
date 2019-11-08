import { Document, Model, model, Schema, Types } from "mongoose";

export interface IFriends extends Document {
    requester: Types.ObjectId;
    recipient: Types.ObjectId;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const friendschema = new Schema({
    requester: { type: Types.ObjectId, required: true, ref: "User" },
    recipient: { type: Types.ObjectId, required: true, ref: "User" },
    status: { type: String, enum: ["requested", "pending", "friends"] },
}, { timestamps: true });

export const Friends: Model<IFriends> = model<IFriends>("Friend", friendschema);
