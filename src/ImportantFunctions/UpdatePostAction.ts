// function to create postaction schema
import { Model } from "mongoose";
import { IPostAction } from "./../models/PostAction";
export const updatePostAction = async (postid: string, comment: string, userid: string, actionType: string, model: Model<IPostAction, {}>) => {
    const postaction = new model({
        actiontype: actionType,
        postId: postid,
        userId: userid,
        commentText: comment,
    });
    const saveaction = await postaction.save();
    return (saveaction);
};
