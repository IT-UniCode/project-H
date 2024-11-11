export interface JwtPayload {
  sub: number;
  name: string;
  email: string;
  id: number;
  iat: number;
  exp: number;
}
