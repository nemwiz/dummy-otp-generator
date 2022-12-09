import { Test } from '@nestjs/testing';
import { OtpService } from './otp.service';

describe('OTP service', () => {
  let otpService: OtpService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [OtpService],
    }).compile();

    otpService = moduleRef.get<OtpService>(OtpService);
  });

  it('should return hello world', () => {
    const message = otpService.getHello();
    expect(message).toBe('Hello World!');
  });
});
