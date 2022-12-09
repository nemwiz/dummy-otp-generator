import { Body, Controller, Get, Post } from '@nestjs/common';
import { OtpService } from './otp.service';
import { CreateUserDto } from './model/create-user.dto';
import { GenerateOtpDto } from './model/generate-otp.dto';
import { VerifyOtpDto } from './model/verify-otp.dto';

@Controller()
export class AppController {
  constructor(private readonly otpService: OtpService) {}

  @Get()
  getHello(): string {
    return this.otpService.getHello();
  }

  @Post('/register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.otpService.registerUser(createUserDto.userName);
  }

  @Post('/generate-otp-code')
  generateOtpCode(@Body() generateOtpDto: GenerateOtpDto) {
    return this.otpService.generateOtp(generateOtpDto.userId);
  }

  @Post('/verify-otp-code')
  verifyOtpCode(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.otpService.verifyOtpCode(
      verifyOtpDto.userId,
      verifyOtpDto.otpCode,
    );
  }
}
