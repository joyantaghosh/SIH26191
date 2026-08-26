import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import 'dotenv/config';
import userRepository from '../features/users/user.repository.js';

/**
 * Google OAuth2 Strategy
 * Finds an existing user by googleId/email or creates a new one.
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const avatar = profile.photos?.[0]?.value;

        let user = await userRepository.findByGoogleId(profile.id);

        if (!user && email) {
          user = await userRepository.findByEmail(email);
        }

        if (!user) {
          user = await userRepository.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
            avatar,
            isVerified: true,
            authProvider: 'google',
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          user.authProvider = 'google';
          user.isVerified = true;
          if (!user.avatar && avatar) user.avatar = avatar;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Not using sessions (stateless JWT), but required by passport typings.
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userRepository.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
