import { ApiResponse, RequestParams } from "@elastic/elasticsearch";
import { genSalt, hash } from "bcryptjs";
import { ObjectID } from "bson";
import jwt from "jsonwebtoken";
import { ConnectionManager } from "./../Connections/dbConnections";
import { updatePostAction } from "./../ImportantFunctions/UpdatePostAction";
import { IResponse } from "./../Interfaces/Response";
import * as Models from "./../ModelsList";

interface ISearchBody {
    index: string;
    body: {
        query: {
            bool: {
                must: [
                    {
                        match: {
                            "profile._id": string,
                        },
                    },
                ],
            },
        },
    };
}

export class DAOManager {
    constructor() { }
    public signup(name: string, phone: number, email: string, password: string, res) {
        Models.User.findOne({ name, phone }, async (err, doc) => {
            if (err) {
                const error: IResponse = { error: true, message: "Some error occured", data: err, status: 500, token: null };
                res.json(error);
                throw new Error("Some error occured: " + err);
            } else if (doc) {
                const error: IResponse = { error: true, message: "Email already exists", data: null, status: 500, token: null };
                res.json(error);
            } else {
                const newuser: any = new Models.User({
                    name,
                    phone,
                    email,
                    password,
                });
                newuser.password = await newuser.generateHash(password);
                newuser.save().then(async (user: any) => {
                    const token = jwt.sign({
                        _id: user._id,
                        name: user.name,
                        phone: user.phone,
                        email: user.email,
                    }, process.env.TOKEN_SECRET, { expiresIn: "1h" });
                    const refreshtoken = jwt.sign({
                        _id: user._id,
                        name: user.name,
                        phone: user.phone,
                        email: user.email,
                    }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
                    const redisClient = ConnectionManager.prototype.redisConnect();
                    const setrefreshtoken = redisClient.set(user._id + "refreshtoken", refreshtoken);
                    const elasticClient = ConnectionManager.prototype.elasticClient();
                    const saveuserelastic = await elasticClient.index({
                        index: "user",
                        body: {
                            profile: user,
                        },
                    });
                    console.log(saveuserelastic);
                    const response: IResponse = { error: false, message: "User Signed Up.", data: user, status: 200, token };
                    res.json(response);

                }).catch((err1) => {
                    const error: IResponse = { error: true, message: "Some error occured", data: err1, status: 500, token: null };
                    res.json(error);
                    throw new Error("Some error occured: " + err1);
                });
            }
        });
    }

    public async update(id, update, res) {
        try {
            if (update.password) {
                const salt = await genSalt(10);
                update.password = await hash(update.password, salt);
            }
            const doc = await Models.User.findOneAndUpdate({ _id: id }, update, { upsert: true, new: true });
            const response: IResponse = { error: false, message: "User Updated.", data: doc, status: 200, token: null };
            res.json(response);
        } catch (error) {
            throw new Error(error);
        }
    }

    public login(email: string, password: string, res) {
        Models.User.findOne({ email }, (err, doc: any) => {
            if (err) {
                const error: IResponse = { error: true, message: "Some error occured", data: err, status: 500, token: null };
                res.json(error);
                throw new Error("Some error occured: " + err);
            } else if (doc === null || doc === undefined) {
                const response: IResponse = { error: true, message: "No User Found", data: err, status: 400, token: null };
                res.json(response);
            } else if (!doc.comparePassword(password, doc.password)) {
                console.log(password);
                const response: IResponse = { error: true, message: "Wrong Password", data: err, status: 401, token: null };
                res.json(response);
            } else {
                const token = jwt.sign({
                    id: doc._id,
                    name: doc.name,
                    phone: doc.phone,
                    email: doc.email,
                }, process.env.TOKEN_SECRET, { expiresIn: "1h" });
                const refreshtoken = jwt.sign({
                    _id: doc._id,
                    name: doc.name,
                    phone: doc.phone,
                    email: doc.email,
                }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
                const redisClient = ConnectionManager.prototype.redisConnect();
                const setrefreshtoken = redisClient.set(doc._id + "refreshtoken", refreshtoken);

                const response: IResponse = { error: false, message: "User Logged In.", data: doc, status: 200, token };
                res.json(response);
                console.log(response);
            }
        });
    }

    public async profile(id: string, res) {
        try {
            const userprofile: any = await Models.User.findById(id).lean();
            if (userprofile) {
                const response: IResponse = { error: false, message: "User Found", data: userprofile, status: 200, token: null };
                res.json(response);
            } else {
                const response: IResponse = { error: true, message: "User Not Found", data: null, status: 404, token: null };
                res.json(response);
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    public async fRequest(requesterid, recipientid, res) {
        const requester = await Models.User.findById(requesterid);
        const recipient = await Models.User.findById(recipientid);
        if (requester) {
            if (recipient) {
                try {
                    const doc1 = new Models.Friends({
                        recipient: recipientid,
                        requester: requesterid,
                        status: "requested",
                    });
                    const doc2 = new Models.Friends({
                        recipient: recipientid,
                        requester: requesterid,
                        status: "pending",
                    });
                    const request1 = await doc1.save();
                    const request2 = await doc2.save();
                    const userA: any = await Models.User.findOneAndUpdate({ _id: requesterid }, { $push: { friends: request1._id } }).lean();
                    const userB: any = await Models.User.findOneAndUpdate({ _id: recipientid }, { $push: { friends: request2._id } }).lean();
                    const resp = {
                        userA,
                        userB,
                    };
                    const response: IResponse = { error: false, message: "Friend Request sent", data: resp, status: 404, token: null };
                    res.json(response);
                } catch (error) {
                    const response: IResponse = { error: true, message: "An error occured", data: null, status: 500, token: null };
                    res.json(response);
                    throw new Error(error);
                }
            } else {
                const response: IResponse = { error: true, message: "Recipient Not Found", data: null, status: 404, token: null };
                res.json(response);
            }
        } else {
            const response: IResponse = { error: true, message: "Requester Not Found", data: null, status: 404, token: null };
            res.json(response);
        }
    }

    public async fAccept(requesterid, recipientid, res) {
        const requester = await Models.User.findById(requesterid);
        const recipient = await Models.User.findById(recipientid);
        if (requester) {
            if (recipient) {
                try {
                    const update1: any = await Models.Friends.findOneAndUpdate({ requester: requesterid, recipient: recipientid, status: "pending" }, { status: "friends" }, { new: true }).lean();
                    const update2: any = await Models.Friends.findOneAndUpdate({ requester: requesterid, recipient: recipientid, status: "requested" }, { status: "friends" }, { new: true }).lean();
                    const resp = {
                        update1,
                        update2,
                    };
                    const response: IResponse = { error: false, message: "Friend Request sent", data: resp, status: 404, token: null };
                    res.json(response);
                } catch (error) {
                    const response: IResponse = { error: true, message: "An error occured", data: null, status: 500, token: null };
                    res.json(response);
                    throw new Error(error);
                }
            } else {
                const response: IResponse = { error: true, message: "Recipient Not Found", data: null, status: 404, token: null };
                res.json(response);
            }
        } else {
            const response: IResponse = { error: true, message: "Requester Not Found", data: null, status: 404, token: null };
            res.json(response);
        }
    }

    public async getPosts(id, res) {
        try {
            const user = await Models.User.findById(id);
            if (user) {
                const posts = await Models.User.aggregate([
                    {
                        $match: {
                            _id: new ObjectID(id),
                        }
                    }, {
                        $lookup: {
                            from: "posts",
                            as: "posts",
                            let: {
                                userid: "$_id",
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: [
                                                "$$userid", "$userid",
                                            ],
                                        },
                                    },
                                }, {
                                    $sort: {
                                        createdAt: -1,
                                    },
                                },
                            ],
                        },
                    },
                ]);
                const response: IResponse = { error: false, message: "Posts", data: posts, status: 200, token: null };
                res.json(response);
            } else {
                const response: IResponse = { error: true, message: "User Not Found", data: null, status: 404, token: null };
                res.json(response);
            }
        } catch (error) {
            const response: IResponse = { error: true, message: "Some error occured", data: error, status: 500, token: null };
            res.json(response);
            throw new Error(error);
        }
    }

    public async logout(id, res) {
        try {
            const user = await Models.User.findById(id);
            if (user) {
                const redisClient = ConnectionManager.prototype.redisConnect();
                redisClient.del(id + "refreshtoken", (err, reply) => {
                    if (reply === 1) {
                        res.send("deleted");
                    } else {
                        res.send("Couldnt delete");
                    }
                });
            } else {
                const response: IResponse = { error: true, message: "User Not Found", data: null, status: 404, token: null };
                res.json(response);
            }
        } catch (error) {
            const response: IResponse = { error: true, message: "Some error occured", data: error, status: 500, token: null };
            res.json(response);
            throw new Error(error);
        }
    }

    public post(id: string, post: string, res) {
        Models.User.findById(id, (err, user) => {
            if (err) {
                const response: IResponse = { error: true, message: "User Not Found", data: err, status: 404, token: null };
                res.json(response);
                throw err;
            } else {
                const newpost = new Models.Post({
                    userid: id,
                    post,
                });
                newpost.save().then((userpost) => {
                    const response: IResponse = { error: false, message: "Post created", data: userpost, status: 200, token: null };
                    res.json(response);
                    console.log(response);
                }).catch((error) => {
                    const response: IResponse = { error: true, message: "Some error occured", data: error, status: 500, token: null };
                    res.json(response);
                    console.log(response);
                });
            }
        });
    }

    public async timeline(userid, res, skip: number, limit: number) {
        try {
            // tslint:disable-next-line: prefer-const
            let postarray = [];
            const user: any = await Models.User.findById(userid);
            if (user) {
                await Models.Post.ensureIndexes({ "userid": 1, "updatedAt": -1, "counts.like": -1 });
                const posts = await Models.Post.find({ userid: user._id }).skip(skip).limit(limit).sort({ "counts.like": -1, "updatedAt": -1 });
                for (let i = user.friends.length; i >= 0; i--) {
                    // tslint:disable-next-line: prefer-const
                    let friend: any = await Models.Friends.findById(user.friends[i]);
                    if (friend) {
                        if (friend.status === "friends") {
                            await Models.Post.ensureIndexes({ "userid": 1, "updatedAt": -1, "counts.like": -1 });
                            // tslint:disable-next-line: prefer-const
                            let friendposts = await Models.Post.find({ userid: friend.recipient }).skip(skip).limit(limit).sort({ "updatedAt": -1, "counts.like": -1 });
                            // tslint:disable-next-line: prefer-const
                            let post = {
                                myposts: posts,
                                friend_posts: friendposts,
                            };
                            postarray.push(post);
                            const redisClient = ConnectionManager.prototype.redisConnect();
                            const setredis = redisClient.set(userid + "_timeline", JSON.stringify(postarray));
                            redisClient.get(userid + "_timeline", (err, reply) => {
                                if (err) {
                                    res.send(postarray);
                                    throw err;
                                } else {
                                    console.log("Got From Redis");
                                    res.send(JSON.parse(reply));
                                }
                            });
                        }
                    }
                }
            } else {
                const response: IResponse = { error: true, message: "User doesnt exist", data: null, status: 404, token: null };
                res.json(response);
            }
        } catch (error) {
            throw new Error(error);
        }
        // const response: IResponse = { error: false, message: "Posts", data: result, status: 200, token: null };
        // res.json(response);
    }

    public async search(userid: string, searchid: string, res) {
        try {
            const finduser = await Models.User.findById(userid);
            if (finduser) {
                const elasticClient = ConnectionManager.prototype.elasticClient();
                const userindex: RequestParams.Search = {
                    index: "user",
                    body: {
                        query: {
                            bool: {
                                must: [
                                    {
                                        match: {
                                            "profile.name": searchid,
                                        },
                                    },
                                ],
                            },
                        },
                    },
                };
                const userresult: ApiResponse = await elasticClient.search(userindex);
                if (userresult) {
                    const response: IResponse = { error: false, message: "Profile found from Elastic", data: userresult, status: 200, token: null };
                    res.json(response);
                } else {
                    const redisClient = ConnectionManager.prototype.redisConnect();
                    redisClient.hget(userid, searchid, async (error, reply) => {
                        if (error) {
                            const response: IResponse = { error: true, message: "An error occurred", data: error, status: 500, token: null };
                            res.json(response);
                        } else if (reply) {
                            const response: IResponse = { error: false, message: "Profile found from Redis", data: reply, status: 200, token: null };
                            res.json(response);
                        } else {
                            const profile = await Models.User.findById(searchid);
                            if (profile) {
                                const response: IResponse = { error: false, message: "Profile found from MongoDB", data: profile, status: 200, token: null };
                                res.json(response);
                                const setprofile = redisClient.hset(userid, searchid, JSON.stringify(profile));
                                const setTTL = redisClient.expire(userid, 604800);
                                console.log("Profile set in redis", setprofile + " with TTL 1 week: ", setTTL);
                            } else {
                                const response: IResponse = { error: true, message: "Profile doesn't exist", data: null, status: 500, token: null };
                                res.json(response);
                            }
                        }
                    });
                }
            } else {
                const response: IResponse = { error: true, message: "User not found", data: null, status: 404, token: null };
                res.json(response);
            }
        } catch (error) {
            const response: IResponse = { error: true, message: "Some error occured", data: error, status: 500, token: null };
            res.json(response);
            console.error(error);
        }
    }

    public async action(status: string, userid: string, postid: string, comment: string, res) {
        switch (status) {
            case "like":
                try {
                    const user = await Models.User.findById(userid);
                    const post = await Models.Post.findById(postid);
                    if (user === null || user === undefined || post === null || post === undefined) {
                        return res.status(404).json({ notfound: "User or post not found" });
                    } else {
                        const findaction = await Models.PostAction.findOne({ userId: userid, postId: postid, actiontype: "like" });
                        if (findaction) {
                            return res.status(500).json({ message: "You cannot like the same post twice." });
                        } else {
                            post.counts.like++;
                            const savepost = await post.save();
                            await updatePostAction(postid, null, userid, status, Models.PostAction).then((saveaction) => {
                                const response = {
                                    Post: savepost,
                                    PostAction: saveaction,
                                };
                                res.send(response);
                            }).catch((err) => {
                                throw err;
                            });
                        }
                    }
                } catch (error) {
                    throw error;
                }
                break;
            ///////////////////////////////////////////
            case "unlike":
                try {
                    const user = await Models.User.findById(userid);
                    const post = await Models.Post.findById(postid);
                    if (user === null || user === undefined || post === null || post === undefined) {
                        return res.status(404).json({ notfound: "User or post not found" });
                    } else {
                        const findaction = await Models.PostAction.findOne({ userId: userid, postId: postid, actiontype: "like" });
                        if (!findaction) {
                            return res.status(500).json({ message: "You cannot unlike the same post twice." });
                        } else {
                            post.counts.like--;
                            const savepost = await post.save();
                            const remove = await findaction.remove();
                            const response = {
                                Post: savepost,
                                PostAction: "post removed" + remove,
                            };
                            res.send(response);
                        }
                    }
                } catch (error) {
                    throw error;
                }
                break;
            ///////////////////////////////////////////////////
            case "comment":
                try {
                    const user = await Models.User.findById(userid);
                    const post = await Models.Post.findById(postid);
                    if (user === null || user === undefined || post === null || post === undefined) {
                        return res.status(404).json({ notfound: "User or post not found" });
                    } else {
                        post.counts.comment++;
                        const savepost = await post.save();
                        const postactionResult = await updatePostAction(postid, comment, userid, status, Models.PostAction);
                        const response = {
                            Post: savepost,
                            PostAction: postactionResult,
                        };
                        return res.status(200).json(response);
                    }
                } catch (error) {
                    console.log(error);
                }
                break;
            ///////////////////////////////////
            case "report":
                try {
                    const user = await Models.User.findById(userid);
                    const post = await Models.Post.findById(postid);
                    if (user === null || user === undefined || post === null || post === undefined) {
                        return res.status(404).json({ notfound: "User or post not found" });
                    } else {
                        const findaction = await Models.PostAction.findOne({ userId: userid, postId: postid, actiontype: "report" });
                        if (findaction) {
                            return res.status(500).json({ message: "You cannot report the same post twice." });
                        } else {
                            post.counts.report++;
                            const savepost = await post.save();
                            await updatePostAction(postid, null, userid, status, Models.PostAction).then((saveaction) => {
                                const response = {
                                    Post: savepost,
                                    PostAction: saveaction,
                                };
                                res.send(response);
                            }).catch((err) => {
                                throw err;
                            });
                        }
                    }
                } catch (error) {
                    throw error;
                }
                break;
            default: res.send("Enter an option in querystring to perform operations. E.g. like, unlike, comment");
        }
    }

    // See a specific post
    public async SeePost(postid, res) {
        try {
            const Post = await Models.Post.findById(postid);
            if (Post) {
                const postresult = await Models.Post.aggregate([
                    {
                        $match: {
                            _id: new ObjectID(postid),
                        },
                    }, {
                        $lookup: {
                            from: "postactions",
                            localField: "_id",
                            foreignField: "postId",
                            as: "actions",
                        },
                    },
                ]);
                const response: IResponse = { error: false, message: "Post Exists", data: postresult, status: 200, token: null };
                res.json(response);
            } else {
                const response: IResponse = { error: true, message: "Post Doesn't Exists.", data: null, status: 404, token: null };
                res.json(response);
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    // User friend list
    public async getFriends(userid, res) {
        try {
            // tslint:disable-next-line: prefer-const
            let friendarray = [];
            const friendcoll: any = await Models.User.findById(userid).populate("friends").exec();
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < friendcoll.friends.length; i++) {
                const friends: any = await Models.Friends.findOne({ recipient: friendcoll.friends[i].recipient }).populate("recipient").select("-__v -_id -requester -createdAt -updatedAt").lean().exec();
                delete friends.recipient.friends;
                delete friends.recipient.password;
                delete friends.recipient.createdAt;
                delete friends.recipient.updatedAt;
                delete friends.recipient.__v;
                friendarray.push(friends);
            }
            res.send(friendarray);
        } catch (error) {
            throw new Error(error);
        }
    }

    public async getcomments(userid, postid, res) {
        try {
            const user = await Models.User.findById(userid);
            if (user) {
                const post = await Models.Post.findById(postid);
                if (post) {
                    const actions = await Models.Post.aggregate([
                        {
                            $match: {
                                _id: new ObjectID(postid),
                            },
                        }, {
                            $lookup: {
                                from: "postactions",
                                as: "comments",
                                let: {
                                    postid: "$_id",
                                },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: [
                                                    "$$postid", "$postId",
                                                ],
                                            },
                                        },
                                    }, {
                                        $sort: {
                                            createdAt: -1,
                                        },
                                    },
                                ],
                            },
                        },
                    ]);
                    const response: IResponse = { error: false, message: "All Comments", data: actions, status: 200, token: null };
                    res.json(response);
                } else {
                    const response: IResponse = { error: true, message: "Post Doesn't Exists.", data: null, status: 404, token: null };
                    res.json(response);
                }
            } else {
                const response: IResponse = { error: true, message: "User Doesn't Exists.", data: null, status: 404, token: null };
                res.json(response);
            }
        } catch (error) {
            throw new Error(error);
        }
    }

}
