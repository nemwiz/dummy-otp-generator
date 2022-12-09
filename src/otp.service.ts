import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { OtpCode } from './model/otp-code';

export const MAX_OTP_CODE = 999999;
export const MIN_OTP_CODE = 100000;

export const OTP_CODE_VALIDITY_PERIOD_SECONDS = 30;

@Injectable()
export class OtpService {
  private userDatabase = new Map<string, string>();
  private otpTokenDatabase: Map<string, OtpCode> = new Map<string, OtpCode>();

  getHello(): string {
    return 'Hello World!';
  }

  registerUser(userName: string): string {
    const userId = uuidv4();
    this.userDatabase.set(userId, userName);
    return userId;
  }

  getUser(userId: string): string {
    const user = this.userDatabase.get(userId);
    if (!user) {
      throw new Error(`The user with id ${userId} does not exist`);
    }
    return user;
  }

  generateOtp(userId: string): OtpCode {
    // checks if user exists
    this.getUser(userId);

    const otpCode = {
      code: this.generateRandomNumber(),
      expiresAtSeconds:
        OtpService.getUnixTimestampInSeconds() +
        OTP_CODE_VALIDITY_PERIOD_SECONDS,
    };

    this.otpTokenDatabase.set(userId, otpCode);

    return otpCode;
  }

  verifyOtpCode(userId: string, otpCode: number): { isValid: boolean } {
    const storedOtpCode = this.otpTokenDatabase.get(userId);

    if (!storedOtpCode) {
      throw new Error(`No OTP code was generated for user ${userId}`);
    }

    if (storedOtpCode && storedOtpCode.code !== otpCode) {
      throw new Error(`Invalid OTP code ${otpCode}`);
    }

    const now = OtpService.getUnixTimestampInSeconds();

    if (now > storedOtpCode.expiresAtSeconds) {
      throw new Error('OTP code expired');
    }

    return { isValid: storedOtpCode.code === otpCode };
  }

  private generateRandomNumber(): number {
    return Math.floor(
      Math.random() * (MAX_OTP_CODE - MIN_OTP_CODE) + MIN_OTP_CODE,
    );
  }

  static getUnixTimestampInSeconds(): number {
    return Math.floor(new Date().getTime() / 1000);
  }
}
