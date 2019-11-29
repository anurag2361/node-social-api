import cluster, { fork, isMaster } from "cluster";
import { cpus } from "os";
import app from "./index";
const numCPUs = cpus().length;

if (isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    app.disable("x-powered-by");
    app.listen(app.get("port"), () => {
        console.log(" App is running at http://localhost:%d in %s mode", process.env.PORT, app.get("env"));
        console.log(" Press CTRL-C to stop\n");
    });
    console.log(`Worker ${process.pid} started`);
}
