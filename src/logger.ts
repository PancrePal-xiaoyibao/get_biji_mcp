/**
 * 日志工具类
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private level: LogLevel;
  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(level: LogLevel = 'info') {
    this.level = level;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.level];
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    const msg = data ? `${message} ${JSON.stringify(data, null, 2)}` : message;
    return `${prefix} ${msg}`;
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog('debug')) {
      process.stderr.write(this.formatMessage('debug', message, data) + '\n');
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog('info')) {
      process.stderr.write(this.formatMessage('info', message, data) + '\n');
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog('warn')) {
      process.stderr.write(this.formatMessage('warn', message, data) + '\n');
    }
  }

  error(message: string, data?: any): void {
    if (this.shouldLog('error')) {
      process.stderr.write(this.formatMessage('error', message, data) + '\n');
    }
  }
}

export const logger = new Logger(
  (process.env.LOG_LEVEL as LogLevel) || 'info'
);
