import mongoose from "mongoose";
import redis from "redis";

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);

export class ConnectionManager {
    constructor() { }
    public async dbConnect() {
        await mongoose.connect("mongodb://localhost:27017/chatdb", { useNewUrlParser: true, autoIndex: false, autoReconnect: true }, (err: any) => {
            if (err) {
                throw new Error(err);
            } else {
                console.log("database connected");
            }
        });
    }

    public redisConnect(): redis.RedisClient {
        const client: redis.RedisClient = redis.createClient();
        client.on("ready", () => {
            console.log("redis is ready");
        });
        // client.AUTH("appinventiv", (err, reply) => {
        //     if (err) {
        //         throw err;
        //     } else {
        //         console.log(reply);
        //     }
        // });
        client.on("error", (err) => {
            console.error("Redis Error: " + err);
        });
        return client;
    }
}
