import { Injectable } from '@nestjs/common';

@Injectable()
export class GbfsService {
  private async getStations() {
    const [statusResponse, infoResponse] = await Promise.all([
      fetch('https://gbfs.nextbike.net/maps/gbfs/v2/nextbike_kg/de/station_status.json'),
      fetch('https://gbfs.nextbike.net/maps/gbfs/v2/nextbike_kg/de/station_information.json')
    ]);

    const statusData = await statusResponse.json();
    const infoData = await infoResponse.json();

    return infoData.data.stations.map((infoStation: any) => {
      const matchedStatus = statusData.data.stations.find(
        (station: any) => station.station_id === infoStation.station_id
      );

      return {
        stationId: infoStation.station_id,
        name: infoStation.name,
        bikesAvailable: matchedStatus?.num_bikes_available ?? 0,
        docksAvailable: matchedStatus?.num_docks_available,
      };
    });
  } 
  async getStationsWithBikes(minNumOfBikes: number): Promise<any[]> {
    const stations = await this.getStations()
    const stationsWithBikes = stations
      .filter((station: any) => station.bikesAvailable >= minNumOfBikes)
      .map((station: any) => {
        return {
          stationId: station.stationId,
          name:  station.name,
          bikesAvailable: station.bikesAvailable,
        };
      });
    return stationsWithBikes;
  }

  async getStationsWithFreeDocks(minNumOfDocks: number) {
  const stations = await this.getStations();

  return stations
    .filter((station: any) => station.docksAvailable >= minNumOfDocks)
    .map((station: any) => ({
      stationId: station.stationId,
      name: station.name,
      docksAvailable: station.docksAvailable,
    }));
}

  async getStationStatus(stationName: string) {
    const stations = await this.getStations();

    return stations.filter(
      (station: any) =>
        station.name.toLowerCase().includes(stationName.toLowerCase())
    );
  }
}