import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/userModel.js';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/users/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            const newUser = {
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
            };

            try {
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    done(null, user);
                } else {
                    user = await User.findOne({ email: newUser.email });
                    if (user) {
                        user.googleId = newUser.googleId;
                        await user.save();
                        done(null, user);
                    } else {
                        user = await User.create(newUser);
                        done(null, user);
                    }
                }
            } catch (err) {
                console.error(err);
                done(err, false);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
});
