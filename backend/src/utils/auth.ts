import passport from "passport"
import {Strategy as GoogleStrategy} from "passport-google-oauth20"

passport.use(new GoogleStrategy({
	clientID: "",
	clientSecret: "",
	callbackURL: "",
}, (accessToken, refreshToken, profile, cb) => {
	const user = {
		id: profile.id,
		name: profile.name,
		email: profile.emails
	}
}));

passport.serializeUser((user, cb) => {
	cb(null, user)
})