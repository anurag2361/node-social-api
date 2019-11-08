import { Document, Model, model, Schema, Types } from "mongoose";

export interface IPostAction extends Document {
    actiontype: string;
    userId: string;
    postId: Types.ObjectId;
    createdAt: Date;
    commentText: string;
}

const postActionSchema = new Schema({
    actiontype: {
        enum: ["like", "comment", "report"],
        index: true,
        type: String,
    },
    userId: {
        type: String,
    },
    postId: {
        type: Types.ObjectId,
    },
    createdAt: {
        type: Date, default: Date.now, required: true,
    },
    commentText: {
        type: String,
    },
});

export const PostAction: Model<IPostAction> = model<IPostAction>("PostAction", postActionSchema);
