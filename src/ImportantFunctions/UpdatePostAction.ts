// function to create postaction schema
export const updatePostAction = async (postid: string, userid: string, actionType: string, model) => {
    const postaction = new model({
        actiontype: actionType,
        postId: postid,
        userId: userid,
    });
    const saveaction = await postaction.save();
    return (saveaction);
};
