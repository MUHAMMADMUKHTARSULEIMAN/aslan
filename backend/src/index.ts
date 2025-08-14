import express from "express";
import passport from "passport";

const app = express();
export default app;

app.use(passport.initialize())
