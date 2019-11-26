import { Client } from "@elastic/elasticsearch";
import mongoose from "mongoose";
import redis from "redis";

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);

export class ConnectionManager {
    constructor() { }
    public async dbConnect() {
        await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, autoIndex: false, autoReconnect: true }, (err: any) => {
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

    public elasticClient(): Client {
        const client = new Client({ node: "http://localhost:9200" });
        return client;
    }
}
