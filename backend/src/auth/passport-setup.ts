import passport, { Profile } from "passport";
// @ts-expect-error
import { Strategy as GoogleStrategy } from "passport-google-oidc";
import Users from "../models/user-model";
import { IUser } from "../types/user";
import config from "../config/config";
import { createLink } from "../controllers/link-controller";

const { googleClientId, googleClientSecret } = config;

export interface LinkingData {
  user: IUser;
  googleId: string;
}

export interface Info {
  message: string;
  linkingId: string;
}

interface CustomVerifyCallback {
  (err: Error | null, user: IUser | false): void;
}

export const initializeGooglePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: "/api/google/redirect",
        scope: ["profile", "email"],
      },
      async function verify(
        issuer: string,
        profile: Profile,
        cb: CustomVerifyCallback
      ) {
        try {
          const email = profile.emails?.[0].value;
          const googleId = profile.id;
          if (!email) {
            return cb(
              new Error("Google profile did not contain an email."),
              false
            );
          }

          let user = await Users.findOne({ googleId });
          if (user) {
            return cb(null, user);
          }

          const existingUser = await Users.findOne({
            email,
            password: { $ne: null, $exists: true },
          });
          if (existingUser) {
            const linkingData: LinkingData = {
              user: existingUser,
              googleId: profile.id,
            };

            const linkingId = await createLink(linkingData);
						await existingUser.updateOne({linkingId})
            return cb(null, existingUser);
          }

          user = await Users.create({
            email,
            googleId: profile.id,
            firstName: profile.name?.givenName || profile.displayName,
            lastName: profile.name?.familyName,
          });

          return cb(null, user);
        } catch (error) {
          return cb(error as Error, false);
        }
      }
    )
  );
};

passport.serializeUser((user: any, cb) => {
  process.nextTick(() => {
    cb(null, user.id);
  });
});

passport.deserializeUser((id: string, cb) => {
  process.nextTick( async () => {
    try {
      const user = await Users.findById(id);
      return cb(null, user);
    } catch (error) {
      return cb(error as Error, undefined);
    }
  });
});
