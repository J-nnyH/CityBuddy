import { Injectable } from '@nestjs/common';

interface GbfsStationInfo {
  station_id: string;
  name: string;
  lat: number;
  lon: number;
}

interface GbfsStationStatus {
  station_id: string;
  num_bikes_available: number;
  num_docks_available: number;
}

interface Station {
  stationId: string;
  name: string;
  bikesAvailable: number;
  docksAvailable: number;
  latitude: number;
  longitude: number;
}

@Injectable()
export class GbfsService {
  private async getStations(): Promise<Station[]> {
    const [statusResponse, infoResponse] = await Promise.all([
      fetch(
        'https://gbfs.nextbike.net/maps/gbfs/v2/nextbike_kg/de/station_status.json',
      ),
      fetch(
        'https://gbfs.nextbike.net/maps/gbfs/v2/nextbike_kg/de/station_information.json',
      ),
    ]);

    if (!statusResponse.ok || !infoResponse.ok) {
      throw new Error('GBFS-Daten konnten nicht abgerufen werden.');
    }

    const statusData = await statusResponse.json();
    const infoData = await infoResponse.json();

    return infoData.data.stations.map((infoStation: GbfsStationInfo) => {
      const matchedStatus = statusData.data.stations.find(
        (station: GbfsStationStatus) =>
          station.station_id === infoStation.station_id,
      );

      return {
        stationId: infoStation.station_id,
        name: infoStation.name,
        bikesAvailable: matchedStatus?.num_bikes_available ?? 0,
        docksAvailable: matchedStatus?.num_docks_available ?? 0,
        latitude: infoStation.lat,
        longitude: infoStation.lon,
      };
    });
  }
  async getStationsWithBikes(minNumOfBikes: number): Promise<Station[]> {
    const stations = await this.getStations();
    return stations.filter(
      (station) => station.bikesAvailable >= minNumOfBikes,
    );
  }

  async getStationsWithFreeDocks(minNumOfDocks: number): Promise<Station[]> {
    const stations = await this.getStations();

    return stations.filter(
      (station) => station.docksAvailable >= minNumOfDocks,
    );
  }

  async getStationStatus(stationName: string): Promise<Station[]> {
    const stations = await this.getStations();

    return stations.filter((station) =>
      station.name.toLowerCase().includes(stationName.toLowerCase()),
    );
  }
}
