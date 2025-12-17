export enum EngineStatus {
  STOPPED = 'stopped',
  RUNNING = 'running',
}

export interface EngineState {
  status: EngineStatus;
  startedAt?: number;
}
