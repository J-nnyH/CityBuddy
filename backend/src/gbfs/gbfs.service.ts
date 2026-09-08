import { Injectable } from '@nestjs/common';

@Injectable()
export class GbfsService {
  async getStationsWithBikes(minNumOfBikes: number): Promise<any[]> {
    const [statusResponse, infoResponse] = await Promise.all([
      fetch('https://gbfs.nextbike.net/maps/gbfs/v2/nextbike_kg/de/station_status.json'),
      fetch('https://gbfs.nextbike.net/maps/gbfs/v2/nextbike_kg/de/station_information.json')
    ]);

    const statusData = await statusResponse.json();
    const infoData = await infoResponse.json();

    const liveStations = statusData.data.stations;
    const infoStations = infoData.data.stations;

    const activeStations = liveStations
      .filter((station: any) => station.num_bikes_available >= minNumOfBikes)
      .map((liveStation: any) => {
        const matchingInfo = infoStations.find(
          (info: any) => info.station_id === liveStation.station_id,
        );

        return {
          stationId: liveStation.station_id,
          name: matchingInfo?.name ?? `Station ${liveStation.station_id}`,
          bikesAvailable: liveStation.num_bikes_available,
        };
      });

    return activeStations;
  }
}