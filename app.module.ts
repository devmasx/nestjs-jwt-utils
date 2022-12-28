import { Module, Controller, Get } from '@nestjs/common';
import { JwtDecode } from './index';

@Controller()
export class AppController {
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
