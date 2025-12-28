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
  (
    err: Error | null,
    user: IUser | false,
    info?: Info
  ): void;
}

export const initializeGooglePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: "/api/google/redirect",
        scope: ["profile"],
        passReqToCallback: true,
      },
      async (req: Request, issuer: string, profile: Profile, done: CustomVerifyCallback) => {
        try {
          const email = profile.emails?.[0].value;
          const googleId = profile.id;
          if (!email) {
            return done(
              new Error("Google profile did not contain an email."),
              false
            );
          }
          let user = await Users.findOne({ googleId });
          if (user) {
            return done(null, user);
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

            return done(null, false, {
              message: "LINKING_REQUIRED",
              linkingId,
            });
          }

          user = await Users.create({
            email,
            googleId: profile.id,
            firstName: profile.name?.givenName || profile.displayName,
            lastName: profile.name?.familyName,
          });

          return done(null, user);
        } catch (error) {
          done(error as Error, false);
        }
      }
    )
  );
};

// passport.serializeUser((user: any, done) => {
//   done(null, user._id);
// });

// passport.deserializeUser(async (id: string, done) => {
//   try {
//     const user = await Users.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error as Error, undefined);
//   }
// });
