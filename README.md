# CityBuddy 🚲

CityBuddy is a full-stack MVP that helps users ask natural-language questions about real-time bike availability in Cologne. Instead of manually checking a station list, users can simply ask things like “Which stations have at least 5 bikes?” or “Where are there free docking spots nearby?” and receive a direct answer together with the relevant stations on a map.

The project combines a modern Angular frontend, a NestJS backend, and an LLM-powered tool-calling flow. It fetches live data from the KVB-Rad GBFS feed, filters the stations based on the user’s request, and presents the result in a clean chat interface.

## Features

- Natural-language chat in German
- Real-time KVB-Rad station data from GBFS feeds
- LLM tool calling for retrieving station information
- Search for stations with available bicycles
- Search for stations with free docking spaces
- Search for a specific station
- Interactive MapLibre map
- Station markers with bicycle and docking-space information
- Browser geolocation to show the user's current location
- Markdown rendering for assistant responses
- Loading and error states

## Tech Stack

### Frontend

- Angular
- TypeScript
- MapLibre GL JS
- ngx-markdown
- OpenStreetMap tiles

### Backend

- NestJS
- TypeScript
- GBFS data integration

### AI Layer

- Groq API
- `openai/gpt-oss-20b`
- Tool calling for structured station queries

## Architecture

The frontend sends the user conversation to the backend API.

The backend passes the conversation and available tools to the LLM. Depending on the request, the model decides which station query tool to use. The backend then calls the appropriate GBFS-based service, retrieves the current station data, and returns both the structured result and the final AI-generated answer.

The frontend uses that response to render the conversation and highlight the relevant stations directly on the map.

```text
User
  ↓
Angular frontend
  ↓
NestJS REST API
  ↓
Groq LLM
  ↓
Tool call
  ↓
KVB-Rad GBFS feeds
  ↓
Structured station data
  ↓
LLM response + station data
  ↓
Chat + MapLibre map
````

## Available tools

CityBuddy currently provides three tools:

* `getStationsWithBikes` – finds stations with at least the requested number of bicycles
* `getStationsWithFreeDocks` – finds stations with at least the requested number of free docking spaces
* `getStationStatus` – finds stations matching a station name

The tools return structured station data including the station name, available bicycles, free docking spaces and coordinates for map display.

## Getting started

### Requirements

- Node.js 24+
- npm
- Groq API key

### Install dependencies

From the project root:

```bash
npm install
```

### Environment setup

Create the backend environment file:

```bash
cp backend/.env.example backend/.env
```

Then add your Groq key:

```env
GROQ_API_KEY=your_api_key
```

### Run backend

```bash
npm run start:backend
```

### Run frontend

```bash
npm run start:frontend
```

## Data source

Station information and current station status are retrieved from the KVB-Rad GBFS feeds provided by Nextbike.

The map uses OpenStreetMap tiles rendered with MapLibre GL JS.

## Future improvements

- add station clustering on the map
- Improve nearby-station suggestions
- Improve mobile layout and accessibility
- add deployment setup