import jwt, { Secret, SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";

const signToken = (payload: any, expiresIn: StringValue | Number) => {
    jwt.sign(payload,
        "duyphuongz" as Secret,
        {
            expiresIn: expiresIn,
            issuer: "goodpages",
            audience: "user"
        } as SignOptions
    )
}

export {
    signToken
}