import { Document, Model, model, Schema, Types } from "mongoose";

export interface IPost extends Document {
    userid: string;
    post: string;
    createdAt: Date;
    updatedAt: Date;
    counts: {
        comment: number;
        like: number;
        report: number;
    };
    isBlocked: boolean;

}

const postschema = new Schema({
    userid: { type: Types.ObjectId, required: true, ref: "User" },
    post: { type: String, required: true },
    counts: {
        comment: { default: 0, min: 0, type: Number },
        like: { default: 0, min: 0, type: Number },
        report: { default: 0, min: 0, type: Number },
    },
    isBlocked: { default: false, type: Boolean },
}, { timestamps: true });

export const Post: Model<IPost> = model<IPost>("Post", postschema);
