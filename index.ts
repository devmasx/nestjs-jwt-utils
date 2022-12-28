import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import jwtDecode from 'jwt-decode';

interface IJwtDataOptions {
  authorizationHeader?: string;
  authScheme?: string;
}

export const JwtDecode = createParamDecorator(
  (options: IJwtDataOptions, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const extractToken = new ExtractToken(request.headers, options);
    return jwtDecode(extractToken.token());
  },
);

export class ExtractToken {
  authHeader: string;
  authScheme: string;
  SPLIT_REGEXP = /(\S+)\s+(\S+)/;

  constructor(
    private headers: any,
    {
      authorizationHeader = 'authorization',
      authScheme = 'Bearer',
    }: IJwtDataOptions = {},
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
