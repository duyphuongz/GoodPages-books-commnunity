import { Request } from 'express';
import { Algorithm } from 'jsonwebtoken';
import { Strategy as JwtStrategy, ExtractJwt, VerifyCallbackWithRequest, StrategyOptionsWithRequest, VerifiedCallback, } from 'passport-jwt';
import { findUserByUsername, findUserWithRoleByUsername } from '../services/user.service';
import { extractRecord, setNewRecord, setRoleForUsername } from '../services/redis.service';
import { RoleName } from '../generated/prisma/enums';

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

        let roleFound = await extractRecord(`auth:token:${username}`);

        if (roleFound) {
            const currentUser = {
                username,
                email,
                role: roleFound
            }
            return done(null, currentUser);
        }

        const userFound = await findUserWithRoleByUsername(username);

        if (userFound == null) {
            return done(null, false, {
                message: "User not found"
            });
        }

        if (userFound.role == null) {
            return done(null, false, {
                message: "User is unauthorized"
            })
        };

        await setRoleForUsername({
            username,
            role: userFound.role.roleName,
            expiresIn: 300
        });

        const currentUser = {
            username,
            email,
            role: userFound.role?.roleName
        }

        return done(null, currentUser);
    } catch (error) {
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