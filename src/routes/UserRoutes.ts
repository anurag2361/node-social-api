import { Request, Response, Router } from "express";
import { DAOManager } from "./../dao/dao";
import { auth } from "./../Middlewares/RouteMiddleware";
const router = Router();

router.get("/hello", (req: Request, res: Response) => {
    res.send("Hello user");
});

router.post("/signup", (req: Request, res: Response) => {
    if (typeof (req.body.name) === `string` && typeof (req.body.phone) === `string` && typeof (req.body.email) === `string` && typeof (req.body.password) === `string`) {
        DAOManager.prototype.signup(req.body.name, req.body.phone, req.body.email, req.body.password, res);
    } else {
        return res.send("Parameters require a combination of string and numbers");
    }
});

router.post("/login", (req: Request, res: Response) => {
    if (typeof (req.body.email) === `string` && typeof (req.body.password) === `string`) {
        DAOManager.prototype.login(req.body.email, req.body.password, res);
    } else {
        return res.send("Parameters requires string");
    }
});

router.get("/:id/profile", auth, (req: Request, res: Response) => {
    DAOManager.prototype.profile(req.params.id, res);
});

router.post("/:id/post", auth, (req: Request, res: Response) => {
    if (typeof (req.body.post) === `string`) {
        DAOManager.prototype.post(req.params.id, req.body.post, res);
    } else {
        return res.send("Parameters requires string");
    }
});

router.get("/:userid/search/:searchid", auth, (req: Request, res: Response) => {
    DAOManager.prototype.search(req.params.userid, req.params.searchid, res);
});

// like,unlike,comment,report api
router.get("/:userid/post/:postid", auth, async (req: Request, res: Response, next) => {
    DAOManager.prototype.action(req.query.status, req.params.userid, req.params.postid, res);
});

// update profile
router.post("/:userid/profile/update", auth, async (req: Request, res: Response) => {
    DAOManager.prototype.update(req.params.userid, req.body, res);
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
    const skip = req.query.skip || 0;
    const limit = req.query.limit || 10;
    DAOManager.prototype.timeline(req.params.userid, res, skip, limit);
});

export const UserRouter = router;
