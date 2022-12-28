# nestjs-jwt-utils

## Usage

## Decode
```ts
import { JwtDecode } from "nestjs-jwt-utils"

@Controller()
export class AppController {
  @Get('/profile')
  profile(@JwtDecode() jwtData) {
    return jwtData;
  }
}
```

Decode JWT from authorization header

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```
