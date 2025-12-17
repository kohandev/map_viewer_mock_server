import { Injectable } from '@nestjs/common';
import { EngineService } from '../engine/engine.service';
import { GeoObject } from './geo.types';

@Injectable()
export class GeoService {
  constructor(private readonly engine: EngineService) {}

  getObjects(): GeoObject[] {
    return this.engine.getObjects();
  }

  getStatus() {
    return this.engine.getStatus();
  }
}
