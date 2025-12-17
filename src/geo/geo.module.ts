import { Module } from '@nestjs/common';
import { GeoController } from './geo.controller';
import { GeoService } from './geo.service';
import { EngineModule } from '../engine/engine.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [EngineModule, AuthModule],
  controllers: [GeoController],
  providers: [GeoService],
})
export class GeoModule {}
