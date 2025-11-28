import passport from "passport";
import { jwtStrategy } from "./passport.jwt.config";

passport.use(jwtStrategy);

export default passport;