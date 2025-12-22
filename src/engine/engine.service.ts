import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { GeoObject } from '../geo/geo.types';
import { random, clamp, calcDirection } from '../geo/geo.utils';
import { EngineState, EngineStatus } from './engine.types';
import {
  BOUNDS,
  MAX_NUMB_POINTS,
  MIN_NUMB_POINTS,
  NUMBER_OF_ADDED_ELEMENTS,
  NUMBER_OF_REMOVED_ELEMENTS,
  PERCENT_OF_CHANGES,
} from '../constatns';

@Injectable()
export class EngineService {
  private readonly logger = new Logger(EngineService.name);

  // ===== STATE =====
  private objects = new Map<string, GeoObject>();
  private state: EngineState = {
    status: EngineStatus.STOPPED,
  };

  // ===== TIMERS =====
  private movementTimer?: NodeJS.Timeout;
  private removeTimer?: NodeJS.Timeout;
  private addTimer?: NodeJS.Timeout;
  private watchdogTimer?: NodeJS.Timeout;

  // ===== CONFIG =====
  private readonly STEP = 0.0002;
  private readonly MAX_SESSION_MS = 15 * 60 * 1000; // 15 minutes

  // =========================================================
  // PUBLIC API
  // =========================================================

  start() {
    if (this.state.status === EngineStatus.RUNNING) {
      return this.getStatus();
    }

    this.logger.log('Engine started');

    this.state = {
      status: EngineStatus.RUNNING,
      startedAt: Date.now(),
    };

    this.initObjects();
    this.startTimers();

    return this.getStatus();
  }

  stop(forced = false) {
    if (this.state.status === EngineStatus.STOPPED) {
      return this.getStatus();
    }

    this.clearTimers();
    this.objects.clear();

    this.state = {
      status: EngineStatus.STOPPED,
    };

    this.logger.warn(`Engine stopped${forced ? ' (forced)' : ''}`);

    return this.getStatus();
  }

  getObjects(): GeoObject[] {
    return Array.from(this.objects.values());
  }

  getStatus() {
    return {
      ...this.state,
      count: this.objects.size,
    };
  }

  // =========================================================
  // INTERNAL LOGIC
  // =========================================================

  private initObjects() {
    const count = Math.floor(random(MIN_NUMB_POINTS, MAX_NUMB_POINTS));
    for (let i = 0; i < count; i++) {
      this.addObject();
    }
  }

  private addObject() {
    const obj: GeoObject = {
      id: randomUUID(),
      lat: random(BOUNDS.minLat, BOUNDS.maxLat),
      lng: random(BOUNDS.minLng, BOUNDS.maxLng),
      direction: 0,
    };

    this.objects.set(obj.id, obj);
  }

  private startTimers() {
    this.movementTimer = setInterval(() => this.moveObjects(), 1000);

    this.removeTimer = setInterval(() => this.removeObjects(), 3000);

    this.addTimer = setInterval(() => this.addObjects(), 5000);

    // watchdog — forced stop
    this.watchdogTimer = setTimeout(() => {
      this.logger.warn('Watchdog timeout reached');
      this.stop(true);
    }, this.MAX_SESSION_MS);
  }

  private clearTimers() {
    if (this.movementTimer) clearInterval(this.movementTimer);
    if (this.removeTimer) clearInterval(this.removeTimer);
    if (this.addTimer) clearInterval(this.addTimer);
    if (this.watchdogTimer) clearTimeout(this.watchdogTimer);

    this.movementTimer = undefined;
    this.removeTimer = undefined;
    this.addTimer = undefined;
    this.watchdogTimer = undefined;
  }

  private moveObjects() {
    const arr = Array.from(this.objects.values());
    if (!arr.length) return;

    const moveCount = Math.floor(arr.length * PERCENT_OF_CHANGES);

    for (let i = 0; i < moveCount; i++) {
      const o = arr[Math.floor(Math.random() * arr.length)];

      const prevLat = o.lat;
      const prevLng = o.lng;

      o.lat = clamp(
        o.lat + random(-this.STEP, this.STEP),
        BOUNDS.minLat,
        BOUNDS.maxLat,
      );

      o.lng = clamp(
        o.lng + random(-this.STEP, this.STEP),
        BOUNDS.minLng,
        BOUNDS.maxLng,
      );

      o.direction = calcDirection(prevLat, prevLng, o.lat, o.lng);
    }
  }

  private removeObjects() {
    const count = Math.floor(random(1, NUMBER_OF_REMOVED_ELEMENTS));
    const keys = Array.from(this.objects.keys());

    for (let i = 0; i < count && keys.length; i++) {
      const key = keys.pop();
      if (key) {
        this.objects.delete(key);
      }
    }
  }

  private addObjects() {
    for (let i = 0; i < NUMBER_OF_ADDED_ELEMENTS; i++) {
      this.addObject();
    }
  }
}
