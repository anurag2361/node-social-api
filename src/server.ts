import app from "./index";

app.listen(app.get("port"), () => {
    console.log(" App is running at http://localhost:%d in %s mode", process.env.PORT, app.get("env"));
    console.log(" Press CTRL-C to stop\n");
});
