import jwt from "jsonwebtoken";
import { IResponse } from "./../Interfaces/Response";
// let decodedToken: string = "";

export const auth = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers.authorization;
    if (token) {
        jwt.verify(token, "98ix0b84gs3r@&$#*np9bgkpfjeib1f9ipe", (err, decoded) => {
            if (err) {
                const response: IResponse = { error: true, message: "Token auth failed", status: 500, data: null, token: null };
                res.json(response);
            } else {
                const decodedToken = decoded;
                next();
            }
        });
    } else {
        const response: IResponse = { error: true, message: "Token not provided", status: 403, data: null, token: null };
        res.status(403).json(response);
    }
};
