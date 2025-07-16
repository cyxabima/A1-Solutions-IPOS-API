import jwt, { JwtPayload } from "jsonwebtoken";

export function generateAccessToken(
    payload: JwtPayload,
    options: object = {expiresIn: "1h"}
) {
    const secret = process.env.SECRET_KEY;
    const token = jwt.sign(payload, secret!, options);
    return token;
}