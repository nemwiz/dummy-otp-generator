import { Controller, Get } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller()
export class AppController {
  constructor(private readonly otpService: OtpService) {}

  @Get()
  getHello(): string {
    return this.otpService.getHello();
  }
}
