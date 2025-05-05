import { LogEvent } from '../entities/LogEvent';

export interface LogEventRepository {
    create(logEvent: Omit<LogEvent, 'id' | 'created_at'>): Promise<LogEvent>;
}