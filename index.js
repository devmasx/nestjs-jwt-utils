"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractToken = exports.JwtDecode = void 0;
const common_1 = require("@nestjs/common");
const jwt_decode_1 = require("jwt-decode");
exports.JwtDecode = (0, common_1.createParamDecorator)((options, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const extractToken = new ExtractToken(request.headers, options);
    return (0, jwt_decode_1.default)(extractToken.token());
});
class ExtractToken {
    constructor(headers, { authorizationHeader = 'authorization', authScheme = 'Bearer', } = {}) {
        this.headers = headers;
        this.SPLIT_REGEXP = /(\S+)\s+(\S+)/;
        this.authHeader = this.headers[authorizationHeader];
        this.authScheme = authScheme;
    }
    token() {
        if (!this.authHeader)
            return null;
        const [_, scheme, value] = this.authHeader.match(this.SPLIT_REGEXP);
        if (this.authScheme == scheme.toLowerCase())
            return null;
        return value;
    }
}
exports.ExtractToken = ExtractToken;
