import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import jwtDecode from 'jwt-decode';

interface IJwtDecodeOptions {
  authorizationHeader?: string;
  authScheme?: string;
}

export const JwtDecode = createParamDecorator(
  (options: IJwtDecodeOptions, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const extractToken = new ExtractToken(request.headers, options);
    const token = extractToken.token();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (e) {
      throw new HttpException('Bad jwt token format', HttpStatus.BAD_REQUEST);
    }
  },
);

export class JwtGuard implements CanActivate {
  constructor(
    private callback: (jwtDecoded: any, jwt: string) => boolean,
    private decodeOptions?: IJwtDecodeOptions,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const extractToken = new ExtractToken(request.headers, this.decodeOptions);
    const token = extractToken.token();
    return this.callback(jwtDecode(token), token);
  }
}

export class JwtScopesGuard extends JwtGuard {
  constructor(scopes: string[], decodeOptions?: IJwtDecodeOptions) {
    const checkIncludeScope = (jwtDecode) =>
      scopes.some((scope) => jwtDecode['scopes'].includes(scope));
    super(checkIncludeScope, decodeOptions);
  }
}

export class ExtractToken {
  authHeader: string;
  authScheme: string;
  SPLIT_REGEXP = /(\S+)\s+(\S+)/;

  constructor(
    private headers: any,
    {
      authorizationHeader = 'authorization',
      authScheme = 'Bearer',
    }: IJwtDecodeOptions = {},
  ) {
    this.authHeader = this.headers[authorizationHeader];
    this.authScheme = authScheme;
  }

  token() {
    if (!this.authHeader) return null;
    const [_, scheme, value] = this.authHeader.match(this.SPLIT_REGEXP);
    if (this.authScheme == scheme.toLowerCase()) return null;

    return value;
  }
}
