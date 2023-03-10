import { Module, Controller, Get, UseGuards } from '@nestjs/common';
import { JwtDecode, JwtGuard, JwtScopesGuard } from './index';
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
  @UseGuards(new JwtVerifyGuard())
  @Get('/verify')
  verify() {
    return {
      success: true,
    };
  }

  @UseGuards(new JwtGuard(({ role }) => role == 'admin'))
  @Get('/admin')
  admin() {
    return {
      success: true,
    };
  }

  @UseGuards(new JwtScopesGuard(['users:admin']))
  @Get('/users/:id')
  profile() {
    return {
      success: true,
    };
  }

  @Get()
  getHello(@JwtDecode() jwtData) {
    return {
      success: true,
      jwtData,
    };
  }

  @Get('/decode')
  decode(
    @JwtDecode({ authorizationHeader: 'x-custom-authorization' }) jwtData,
  ) {
    return {
      success: true,
      jwtData,
    };
  }
}

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
