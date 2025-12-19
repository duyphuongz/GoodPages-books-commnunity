import { Request } from 'express';
import { Algorithm } from 'jsonwebtoken';
import { Strategy as JwtStrategy, ExtractJwt, VerifyCallbackWithRequest, StrategyOptionsWithRequest, VerifiedCallback, } from 'passport-jwt';
import { findUserByUsername, findUserWithRoleByUsername } from '../services/user.service';
import { extractRecord, setNewRecord, setRoleForUsername } from '../services/redis.service';

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
        const { username, email } = jwtPayload;
        console.log(">>> jwtPayload:", jwtPayload);

        let roleFound = await extractRecord(`auth:token:${username}`);
        console.log(">>> roleFound:", roleFound);

        if (roleFound) {
            const currentUser = {
                username,
                email,
                role: roleFound
            }
            return done(null, currentUser);
        };

        const userFound = await findUserWithRoleByUsername(username);
        console.log(">>> userFound:", userFound);

        if (userFound == null) {
            return done(null, false, {
                message: "User not found"
            });
        }
        console.log(">>> user is existed");

        if (userFound.role == null) {
            return done(null, false, {
                message: "User is unauthorized"
            })
        };
        console.log(">>> user has role");

        await setRoleForUsername({
            username,
            role: userFound.role.roleName,
            expiresIn: 300
        });
        console.log(">>> set up Redis for token successfully");

        const currentUser = {
            username,
            email,
            role: userFound.role?.roleName
        }
        console.log(">>> valdate token successfully");
        return done(null, currentUser);
    } catch (error) {
        console.log(">>> validate token failed");
        return done(error as any, false);
    }
}

const jwtStrategy = new JwtStrategy(
    options,
    verify
);

export {
    jwtStrategy
}