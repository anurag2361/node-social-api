import bcrypt from "bcryptjs";
import { Document, Model, model, Schema, Types } from "mongoose";

export interface IUser extends Document {
    name: string;
    phone: number;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const userschema = new Schema({
    name: { type: String, required: true },
    phone: { type: Number, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    friends: [{ type: Types.ObjectId, ref: "Friend" }],
}, {
    timestamps: true,
});

userschema.methods.generateHash = async (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userschema.methods.comparePassword = (password, userpassword) => {
    return bcrypt.compareSync(password, userpassword);
};

export const User: Model<IUser> = model<IUser>("User", userschema);
