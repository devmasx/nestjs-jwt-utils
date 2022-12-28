import { CanActivate, ExecutionContext } from '@nestjs/common';
interface IJwtDecodeOptions {
    authorizationHeader?: string;
    authScheme?: string;
}
export declare const JwtDecode: (...dataOrPipes: (import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | IJwtDecodeOptions)[]) => ParameterDecorator;
export declare class JwtGuard implements CanActivate {
    private callback;
    private decodeOptions?;
    constructor(callback: (jwtDecoded: any) => boolean, decodeOptions?: IJwtDecodeOptions);
    canActivate(context: ExecutionContext): boolean;
}
export declare class JwtScopesGuard extends JwtGuard {
    constructor(scopes: string[], decodeOptions?: IJwtDecodeOptions);
}
export declare class ExtractToken {
    private headers;
    authHeader: string;
    authScheme: string;
    SPLIT_REGEXP: RegExp;
    constructor(headers: any, { authorizationHeader, authScheme, }?: IJwtDecodeOptions);
    token(): string;
}
export {};
