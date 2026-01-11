import passport, { Profile } from "passport";
// @ts-expect-error
import { Strategy as GoogleStrategy } from "passport-google-oidc";
import Users from "../models/user-model";
import { IUser } from "../types/user";
import config from "../config/config";
import { createLink } from "../controllers/link-controller";
import type { Types } from "mongoose";
import CustomError from "../utils/custom-error";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, LINKING_ID_EXPIRY } = config;

export interface LinkingData {
  user: IUser;
  googleId: string;
}

export interface Info {
  message: string;
  linkingId: Types.ObjectId;
}

interface CustomVerifyCallback {
  (err: CustomError | null, user: IUser | false): void;
}

export const initializeGooglePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/google/redirect",
        scope: ["profile", "email"],
        session: false,
      },
      async function verify(
        issuer: string,
        profile: Profile,
        cb: CustomVerifyCallback
      ) {
        const googleId = profile.id;

        let user = await Users.findOne({ googleId });
        if (user) {
          return cb(null, user);
        }

        const email = profile.emails?.[0].value;
        if (!email) {
          return cb(
            new CustomError(404, "Google profile did not contain an email."),
            false
          );
        }

        const existingUser = await Users.findOne({
          email,
          password: { $ne: null, $exists: true },
        })
        if (existingUser) {
          const linkingId = await createLink(googleId);
          await existingUser.updateOne({ linkingId, linkingIdExpiry: Date.now() + (LINKING_ID_EXPIRY * 1000)  });
          return cb(null, existingUser);
        }

        user = await Users.insertOne({
          email,
          googleId: profile.id,
          firstName: profile.name?.givenName || profile.displayName,
          lastName: profile.name?.familyName,
        });

        return cb(null, user);
      }
    )
  );
};

passport.serializeUser((user: any, cb) => {
  process.nextTick(() => {
    return cb(null, user.id);
  });
});

passport.deserializeUser((user: IUser, cb) => {
  process.nextTick(async () => {
    return cb(null, user);
  });
});
