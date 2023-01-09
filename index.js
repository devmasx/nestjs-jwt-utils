"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.ExtractToken = exports.JwtScopesGuard = exports.JwtGuard = exports.JwtDecode = void 0;
var common_1 = require("@nestjs/common");
var jwt_decode_1 = require("jwt-decode");
exports.JwtDecode = (0, common_1.createParamDecorator)(function (options, ctx) {
    var request = ctx.switchToHttp().getRequest();
    var extractToken = new ExtractToken(request.headers, options);
    var token = extractToken.token();
    if (!token)
        return null;
    try {
        return (0, jwt_decode_1["default"])(token);
    }
    catch (e) {
        throw new common_1.HttpException('Bad jwt token format', common_1.HttpStatus.BAD_REQUEST);
    }
});
var JwtGuard = /** @class */ (function () {
    function JwtGuard(callback, decodeOptions) {
        this.callback = callback;
        this.decodeOptions = decodeOptions;
    }
    JwtGuard.prototype.canActivate = function (context) {
        var request = context.switchToHttp().getRequest();
        var extractToken = new ExtractToken(request.headers, this.decodeOptions);
        var token = extractToken.token();
        return this.callback((0, jwt_decode_1["default"])(token), token);
    };
    return JwtGuard;
}());
exports.JwtGuard = JwtGuard;
var JwtScopesGuard = /** @class */ (function (_super) {
    __extends(JwtScopesGuard, _super);
    function JwtScopesGuard(scopes, decodeOptions) {
        var checkIncludeScope = function (jwtDecode) {
            return scopes.some(function (scope) { return jwtDecode['scopes'].includes(scope); });
        };
        return _super.call(this, checkIncludeScope, decodeOptions) || this;
    }
    return JwtScopesGuard;
}(JwtGuard));
exports.JwtScopesGuard = JwtScopesGuard;
var ExtractToken = /** @class */ (function () {
    function ExtractToken(headers, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.authorizationHeader, authorizationHeader = _c === void 0 ? 'authorization' : _c, _d = _b.authScheme, authScheme = _d === void 0 ? 'Bearer' : _d;
        this.headers = headers;
        this.SPLIT_REGEXP = /(\S+)\s+(\S+)/;
        this.authHeader = this.headers[authorizationHeader];
        this.authScheme = authScheme;
    }
    ExtractToken.prototype.token = function () {
        if (!this.authHeader)
            return null;
        var _a = this.authHeader.match(this.SPLIT_REGEXP), _ = _a[0], scheme = _a[1], value = _a[2];
        if (this.authScheme == scheme.toLowerCase())
            return null;
        return value;
    };
    return ExtractToken;
}());
exports.ExtractToken = ExtractToken;
