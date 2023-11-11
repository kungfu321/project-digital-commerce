import { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from 'jose';

export const isAuthenticatedSVOnly = async (request: NextRequest, roles?: string[]) => {
  const token = request.cookies.get('token');

  const isValidToken = await verifyJwtToken(token?.value as string) as { role: string; userId: number; };
  const isValidRole = roles?.includes(isValidToken?.role);

  return { isValidToken, isValidRole };
};

export const signJwtToken = async (data: {
  userId: number,
  role: string
}) => {
  try {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60 * 24 * 30;

    return new SignJWT(data)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setExpirationTime(exp)
      .setIssuedAt(iat)
      .setNotBefore(iat)
      .sign(new TextEncoder().encode(process.env.JWT_SECRET as string));
  } catch (error) {
    return null;
  }
}

export const verifyJwtToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET as string));
    return payload;
  } catch (error) {
    return false;
  }
}
