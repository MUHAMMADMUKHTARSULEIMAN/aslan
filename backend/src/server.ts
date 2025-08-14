import mongoose from "mongoose";
import app from "./index";
import config from "./config/config";

const {nodeENV, port, mongodbURI} = config;

mongoose.connect(mongodbURI, {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
    },
}).then((conn) => {
    console.log("Database connected successfully");
}).catch((error) => {
    console.log(error);
});

app.listen(port, () => {
	console.log("Server has started.");
    console.log(nodeENV);
});