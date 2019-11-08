import jwt from "jsonwebtoken";
import { ConnectionManager } from "./../Connections/dbConnections";
import { IResponse } from "./../Interfaces/Response";
// let decodedToken: string = "";

// pass access and refresh token
export const auth = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers.authorization;
    if (token) {
        jwt.verify(token, "98ix0b84gs3r@&$#*np9bgkpfjeib1f9ipe", null, (err, decoded) => {
            // console.log(decoded);
            if (err) {
                if (err.name === "TokenExpiredError") {
                    // console.log(req.params.userid);
                    const redisclient = ConnectionManager.prototype.redisConnect();
                    redisclient.get(req.params.userid + "refreshtoken", (err1, reply) => {
                        if (err1) {
                            throw (err1);
                        } else {
                            // console.log(reply);
                            const refresh = jwt.verify(reply, "98ix0b84gs3r@&$#*np9bgkpfjeib1f9ipe", null);
                            // console.log(refresh);
                            req.decoded = refresh;
                            next();
                        }
                    });
                } else if (err) {
                    return res.json({ success: false, message: "Failed to authenticate token.", err });
                }
                // const response: IResponse = { error: true, message: "Token auth failed", status: 500, data: err, token: null };
                // res.json(response);
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        const response: IResponse = { error: true, message: "Token not provided", status: 403, data: null, token: null };
        res.status(403).json(response);
    }
};
