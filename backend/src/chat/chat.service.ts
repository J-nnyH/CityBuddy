import { Injectable } from '@nestjs/common';
import { GbfsService} from '../gbfs/gbfs.service'

@Injectable()
export class ChatService {
  constructor(private readonly gbfsService: GbfsService) {}
  chat() {
    const stationsWithBikes = this.gbfsService.getStationsWithBikes(1);
    return stationsWithBikes
  }
}
