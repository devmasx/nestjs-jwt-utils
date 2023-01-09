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

## Guard
```ts
import { JwtDecode, JwtGuard, JwtScopesGuard } from "nestjs-jwt-utils"

@Controller()
export class AppController {
  @UseGuards(new JwtGuard(({ role }) => role == 'admin'))
  @Get('/profile')
  profile(@JwtDecode() jwtData) {
    return jwtData;
  }

  @UseGuards(new JwtScopesGuard(['users:admin']))
  @Get('/users/:id')
  profile() {
    return {
      success: true,
    };
  }
}
```

## Custom Guard
```ts
import { JwtDecode } from "nestjs-jwt-utils"
import jsonwebtoken from 'jsonwebtoken';

class JwtVerifyGuard extends JwtGuard {
  constructor() {
    super((_decoded, jwt) => {
      try {
        jsonwebtoken.verify(jwt, 'shhhhh');
      } catch {
        return false;
      }
    });
  }
}

@Controller()
export class AppController {
  @UseGuards(JwtVerifyGuard)
  @Get('/profile')
  profile() {
    return {};
  }
}
```

Decode JWT from authorization header

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```
