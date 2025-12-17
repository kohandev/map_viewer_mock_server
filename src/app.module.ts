import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EngineModule } from './engine/engine.module';
import { GeoModule } from './geo/geo.module';

@Module({
  imports: [AuthModule, EngineModule, GeoModule],
})
export class AppModule {}
