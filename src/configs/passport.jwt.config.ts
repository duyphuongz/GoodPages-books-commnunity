import { Request } from 'express';
import { Algorithm } from 'jsonwebtoken';
import { Strategy as JwtStrategy, ExtractJwt, VerifyCallbackWithRequest, StrategyOptionsWithRequest, VerifiedCallback, } from 'passport-jwt';
import { findUserByUsername } from '../services/user.service';

const options: StrategyOptionsWithRequest = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "duyphuongz",
    issuer: "goodpages",
    audience: "user",
    algorithms: ["HS256"] as Algorithm[],
    passReqToCallback: true
}

const verify: VerifyCallbackWithRequest = async (req: Request, jwtPayload: any, done: VerifiedCallback) => {
    try {
        let username = jwtPayload.username;
        const userFound = await findUserByUsername(username);

        if (userFound == null) {
            return done(req, null, {
                message: "User not found"
            });
        }

        return done(req, userFound);
    } catch (error) {
        return done(error, false);
    }
}

const jwtStrategy = new JwtStrategy(
    options,
    verify
);

export {
    jwtStrategy
}