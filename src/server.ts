import app from "./index";
app.disable("x-powered-by");
app.listen(app.get("port"), () => {
    console.log(" App is running at http://localhost:%d in %s mode", process.env.PORT, app.get("env"));
    console.log(" Press CTRL-C to stop\n");
});
