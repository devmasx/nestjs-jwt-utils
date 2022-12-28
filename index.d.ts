interface IJwtDataOptions {
    authorizationHeader?: string;
    authScheme?: string;
}
export declare const JwtDecode: (...dataOrPipes: (IJwtDataOptions | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
export declare class ExtractToken {
    private headers;
    authHeader: string;
    authScheme: string;
    SPLIT_REGEXP: RegExp;
    constructor(headers: any, { authorizationHeader, authScheme, }?: IJwtDataOptions);
    token(): string;
}
export {};
