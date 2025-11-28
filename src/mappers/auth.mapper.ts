import { SignInResponse, SignUpResponse, ChangePasswordResponse } from "../responseDtos/auth.dto";

const signUpMapper = (user: any, accessToken: string, refreshToken: string) => {
    return new SignUpResponse({
        username: user.username,
        role: user.role.roleName,
        accessToken,
        refreshToken
    });
};

const signInMapper = (user: any, accessToken: string, refreshToken: string) => {
    return new SignInResponse({
        username: user.username,
        role: user.role.roleName,
        accessToken,
        refreshToken
    });
}

const changePasswordMapper = (accessToken: string, refreshToken: string) => {
    return new ChangePasswordResponse({
        accessToken,
        refreshToken
    })
};

export {
    signUpMapper,
    signInMapper,
    changePasswordMapper
}