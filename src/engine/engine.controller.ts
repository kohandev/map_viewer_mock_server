import { Controller, Get, UseGuards } from '@nestjs/common';
import { EngineService } from './engine.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';

@Controller('engine')
@UseGuards(AuthGuard)
export class EngineController {
  constructor(
    private readonly engine: EngineService,
    private readonly auth: AuthService,
  ) {}

  @Get('start')
  start() {
    return this.engine.start();
  }

  @Get('stop')
  stopAndReset() {
    this.engine.stop(false);
    this.auth.reset();
    return { status: 'stopped', tokenReset: true };
  }
}
