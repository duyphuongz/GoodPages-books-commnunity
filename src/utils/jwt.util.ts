import jwt, { Secret, SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import { JwtPayload } from "../type";

const signToken = (payload: JwtPayload, expiresIn: StringValue | Number) => {
    return jwt.sign(payload,
        "duyphuongz" as Secret,
        {
            expiresIn: expiresIn,
            issuer: "goodpages",
            audience: "user",
            algorithms: ["HS256"]
        } as SignOptions
    )
}

export {
    signToken
}