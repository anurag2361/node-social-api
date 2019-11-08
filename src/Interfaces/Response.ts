/* This interface is used to generate a standardized response wherever needed. */
import { IFriends } from "./../models/Friends";
import { IPost } from "./../models/PostModel";
import { IUser } from "./../models/UserModel";
export interface IResponse {
    error: boolean;
    message: string;
    status: number;
    data: string | IUser | {} | IFriends | IPost | Error;
    token: string;
}
