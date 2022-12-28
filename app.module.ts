import { Module, Controller, Get, UseGuards } from '@nestjs/common';
import { JwtDecode, JwtGuard, JwtScopesGuard } from './index';

@Controller()
export class AppController {
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
}

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
