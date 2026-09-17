import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Map, Marker, Popup } from 'maplibre-gl';
import { MapStation } from '../types/chat-message';

@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent implements AfterViewInit, OnChanges {
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  @Input() stations: MapStation[] = [];

  private map?: Map;
  private markers: Marker[] = [];

  ngAfterViewInit(): void {
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'osm-layer',
            type: 'raster',
            source: 'osm',
          },
        ],
      },
      center: [6.9603, 50.9364],
      zoom: 11,
      minZoom: 10,
      maxZoom: 19,
      //   maxBounds: [
      //     [6.75, 50.80],
      //     [7.20, 51.10],
      //   ],
    });

    this.updateMarkers();
    this.map.addControl(new GeolocationControl(), 'top-right');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stations']) {
      this.updateMarkers();
    }
  }

  private updateMarkers(): void {
    if (!this.map) {
      return;
    }

    this.markers.forEach((marker) => marker.remove());
    this.markers = [];

    this.stations.forEach((station) => {
      const marker = new Marker({ color: '#2563eb' })
        .setLngLat([station.longitude, station.latitude])
        .setPopup(
          new Popup().setHTML(`
            <strong>${station.name}</strong><br>
            Fahrräder: ${station.bikesAvailable}<br>
            Freie Plätze: ${station.docksAvailable}
          `),
        )
        .addTo(this.map!);
      marker.getElement().addEventListener('click', () => {
        this.map?.flyTo({
          center: [station.longitude, station.latitude],
        });
      });

      this.markers.push(marker);
    });
  }
}
class GeolocationControl {
  private container!: HTMLDivElement;
  private userMarker?: Marker;

  onAdd(map: Map): HTMLElement {
    this.container = document.createElement('div');
    this.container.className = 'maplibregl-ctrl maplibregl-ctrl-group';

    const button = document.createElement('button');

    button.type = 'button';
    button.title = 'Meinen Standort anzeigen';
    button.innerHTML = '⌖';

    button.addEventListener('click', () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;

          const userMarkerElement = document.createElement('div');

          userMarkerElement.style.width = '10px';
          userMarkerElement.style.height = '10px';
          userMarkerElement.style.background = '#eb2525';
          userMarkerElement.style.border = '3px solid white';
          userMarkerElement.style.borderRadius = '50%';
          userMarkerElement.style.boxShadow = '0 0 0 2px #eb2525';

          this.userMarker?.remove();

          this.userMarker = new Marker({
            element: userMarkerElement,
          })
            .setLngLat([longitude, latitude])
            .addTo(map);

          map.flyTo({
            center: [longitude, latitude],
          });
        },
        (error) => {
          console.error('Standort konnte nicht ermittelt werden:', error);
        },
      );
    });

    this.container.appendChild(button);

    return this.container;
  }

  onRemove(): void {
    this.userMarker?.remove();
    this.container.remove();
  }
}
