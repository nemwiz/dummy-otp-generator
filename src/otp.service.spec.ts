import { Test } from '@nestjs/testing';
import {
  MAX_OTP_CODE,
  MIN_OTP_CODE,
  OTP_CODE_VALIDITY_PERIOD_SECONDS,
  OtpService,
} from './otp.service';

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

  it('register a user', () => {
    const dummyUsername = 'dummyUsername';
    const userId = otpService.registerUser(dummyUsername);

    expect(userId).toBeDefined();

    const userName = otpService.getUser(userId);
    expect(userName).toEqual(dummyUsername);
  });
  it('throws an error if user does not exist', () => {
    const nonExistingUserId = '123jklas';

    expect(() => {
      otpService.getUser(nonExistingUserId);
    }).toThrow();
  });
  it('generates an otp code within range and validity of 30 seconds', () => {
    const dummyUsername = 'dummyUsername';
    const userId = otpService.registerUser(dummyUsername);

    const dummyDate = 1670559387;

    jest
      .spyOn(OtpService, 'getUnixTimestampInSeconds')
      .mockReturnValueOnce(dummyDate);

    const expectedDate = dummyDate + OTP_CODE_VALIDITY_PERIOD_SECONDS;

    const otpCode = otpService.generateOtp(userId);

    expect(otpCode.code >= MIN_OTP_CODE).toBe(true);
    expect(otpCode.code <= MAX_OTP_CODE).toBe(true);

    expect(otpCode.expiresAtSeconds).toEqual(expectedDate);
  });
  it('throws an error if there is no code for this user', () => {
    const dummyUsername = 'dummyUsername';
    const userId = otpService.registerUser(dummyUsername);
    const nonExistingCode = 918231;

    expect(() => {
      otpService.verifyOtpCode(userId, nonExistingCode);
    }).toThrow();
  });
  it('throws an error if the otp code has expired', () => {
    const dummyUsername = 'dummyUsername';
    const userId = otpService.registerUser(dummyUsername);

    const dummyDate = 1670559387;

    jest
      .spyOn(OtpService, 'getUnixTimestampInSeconds')
      .mockReturnValueOnce(dummyDate);

    const otpCode = otpService.generateOtp(userId);

    jest
      .spyOn(OtpService, 'getUnixTimestampInSeconds')
      .mockReturnValue(dummyDate + 1000);

    expect(() => {
      otpService.verifyOtpCode(userId, otpCode.code);
    }).toThrow();
  });
  it('returns true if otp code is valid', () => {
    const dummyUsername = 'dummyUsername';
    const userId = otpService.registerUser(dummyUsername);

    const dummyDate = 1670559387;

    jest
      .spyOn(OtpService, 'getUnixTimestampInSeconds')
      .mockReturnValueOnce(dummyDate);

    const otpCode = otpService.generateOtp(userId);

    jest
      .spyOn(OtpService, 'getUnixTimestampInSeconds')
      .mockReturnValue(dummyDate + 10);

    expect(otpService.verifyOtpCode(userId, otpCode.code).isValid).toEqual(
      true,
    );
  });
});
