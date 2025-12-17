import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  private token: string | null = null;

  generateToken() {
    this.token = randomUUID();
    return { token: this.token };
  }

  validate(token?: string) {
    if (!this.token || token !== this.token) {
      throw new UnauthorizedException('Invalid or missing token');
    }
  }

  reset() {
    this.token = null;
  }

  hasToken() {
    return Boolean(this.token);
  }
}
