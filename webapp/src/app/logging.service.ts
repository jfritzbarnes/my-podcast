import { Injectable } from '@angular/core';

@Injectable()
export class LoggingService {
  private logs: string[] = [];

  constructor() {}

  clearLog(): void {
    this.logs = [];
  }

  appendLog(msg: string): void {
    const d = new Date();
    const dateStr = d.toLocaleString();
    this.logs.push(`${dateStr}: ${msg}`);
  }

  getLogs(): string[] {
    return this.logs;
  }
}
