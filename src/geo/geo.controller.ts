import { Controller, Get, UseGuards } from '@nestjs/common';
import { GeoService } from './geo.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('geo')
@UseGuards(AuthGuard)
export class GeoController {
  constructor(private readonly geo: GeoService) {}

  @Get()
  getObjects() {
    return {
      status: this.geo.getStatus().status,
      data: this.geo.getObjects(),
    };
  }
}
