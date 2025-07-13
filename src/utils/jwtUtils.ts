import jwt, { JwtPayload } from "jsonwebtoken";

interface SignOption {
    expiresIn?: string | number;
}
const DEFAULT_SIGN_OPTION: SignOption = {
    expiresIn: "1h",
};
export function generateAccessToken(
    payload: JwtPayload,
    options: SignOption = DEFAULT_SIGN_OPTION
) {
    const secret = process.env.SECRET_KEY;
    // Use this command to generate SECRET_KEY: openssl rand -base64 32
    const token = jwt.sign(payload, secret!, options);
    return token;
}