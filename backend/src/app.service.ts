import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'CityBuddy API is running.';
  }

  getHealth(): { status: string } {
    return { status: 'ok' };
  }
}
