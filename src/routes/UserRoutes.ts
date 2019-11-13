import { Request, Response, Router } from "express";
import { DAOManager } from "./../dao/dao";
import { auth } from "./../Middlewares/RouteMiddleware";
const router = Router();

router.get("/hello", (req: Request, res: Response) => {
    res.send("Hello user");
});

// signup
router.post("/signup", (req: Request, res: Response) => {
    if (typeof (req.body.name) === `string` && typeof (req.body.phone) === `string` && typeof (req.body.email) === `string` && typeof (req.body.password) === `string`) {
        DAOManager.prototype.signup(req.body.name, req.body.phone, req.body.email, req.body.password, res);
    } else {
        return res.send("Parameters require a combination of string and numbers");
    }
});

// login
router.post("/login", (req: Request, res: Response) => {
    if (typeof (req.body.email) === `string` && typeof (req.body.password) === `string`) {
        DAOManager.prototype.login(req.body.email, req.body.password, res);
    } else {
        return res.send("Parameters requires string");
    }
});

// open profile
router.get("/:userid/profile", auth, (req: Request, res: Response) => {
    const request: any = req;
    if (request.decoded.id) {
        DAOManager.prototype.profile(request.decoded.id, res);
    } else if (request.decoded._id) {
        DAOManager.prototype.profile(request.decoded._id, res);
    }
});

// make a post
router.post("/:userid/post", auth, (req: Request, res: Response) => {
    if (typeof (req.body.post) === `string`) {
        const request: any = req;
        if (request.decoded.id) {
            DAOManager.prototype.post(request.decoded.id, req.body.post, res);
        } else if (request.decoded._id) {
            DAOManager.prototype.post(request.decoded._id, req.body.post, res);
        }
    } else {
        return res.send("Parameters requires string");
    }
});

// search profile
router.get("/:userid/search/:searchid", auth, (req: Request, res: Response) => {
    DAOManager.prototype.search(req.params.userid, req.params.searchid, res);
});

// like,unlike,comment,report api
router.get("/:userid/post/:postid", auth, async (req: Request, res: Response, next) => {
    const comment = req.body.comment;
    const request: any = req;
    if (request.decoded.id) {
        if (comment) {
            DAOManager.prototype.action(req.query.status, request.decoded.id, req.params.postid, comment, res);
        } else {
            DAOManager.prototype.action(req.query.status, request.decodec.id, req.params.postid, null, res);
        }
    } else if (request.decoded._id) {
        if (comment) {
            DAOManager.prototype.action(req.query.status, request.decoded._id, req.params.postid, comment, res);
        } else {
            DAOManager.prototype.action(req.query.status, request.decodec._id, req.params.postid, null, res);
        }
    }
});

// update profile
router.post("/:userid/profile/update", auth, async (req: Request, res: Response) => {
    const request: any = req;
    // console.log(request.decoded);
    if (request.decoded.id) {
        DAOManager.prototype.update(request.decoded.id, req.body, res);
    } else if (request.decoded._id) {
        DAOManager.prototype.update(request.decoded._id, req.body, res);
    }
});

// friend request
router.get("/:requesterid/request/:recipientid/", auth, (req: Request, res: Response) => {
    DAOManager.prototype.fRequest(req.params.requesterid, req.params.recipientid, res);
});

// friend request accept
router.get("/:requesterid/accept/:recipientid/", auth, (req: Request, res: Response) => {
    DAOManager.prototype.fAccept(req.params.requesterid, req.params.recipientid, res);
});

// timeline
router.get("/:userid/timeline", auth, (req: Request, res: Response) => {
    const request: any = req;
    // console.log(request.decoded);
    if (request.decoded.id) {
        const skip = req.query.skip || 0;
        const limit = req.query.limit || 10;
        DAOManager.prototype.timeline(request.decoded.id, res, skip, limit);
    } else if (request.decoded._id) {
        const skip = req.query.skip || 0;
        const limit = req.query.limit || 10;
        DAOManager.prototype.timeline(request.decoded._id, res, skip, limit);
    }
});

// see post
router.get("/post/:postid", auth, (req: Request, res: Response) => {
    DAOManager.prototype.SeePost(req.params.postid, res);
});

export const UserRouter = router;
