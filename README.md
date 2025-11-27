# Sustainability Sync Board

A full-stack application for ingesting, normalizing, and displaying carbon emissions data from multiple inconsistent sources.

## Project Structure

```
/frontend          - Angular 16 application
  /src
    /app
      /dashboard   - Dashboard module (lazy loaded)
      /sync        - Sync module (lazy loaded)
      /shared      - Shared services
/backend           - Node.js Express API
  /routes          - API routing
  /controllers     - Business logic
  /middleware      - Custom middleware
  /config          - Database configuration
/data              - Mock data sources
/docs              - Documentation
```

## Features

- Lazy-loaded Angular modules for optimal performance
- Reactive programming with RxJS Observables
- RESTful API with Express middleware
- Oracle Database integration
- Intelligent data normalization
- Rule-based unit conversion
- Real-time dashboard updates

## Prerequisites

- Node.js 16 or higher
- Angular CLI 16
- Oracle Database
- npm or yarn

## Installation

### 1. Backend Setup

```bash
cd backend
npm install
```

Configure your Oracle database credentials in `backend/.env`:
```
DB_USER=your_oracle_username
DB_PASSWORD=your_oracle_password
DB_CONNECTION_STRING=localhost:1521/XEPDB1
```

Create the database schema:
```sql
sqlplus username/password@connection_string
@config/schema.sql
```

Start the backend server:
```bash
npm start
```

The API will run on `http://localhost:3000`

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Start the development server:
```bash
npm start
```

The application will open at `http://localhost:4200`

## Usage

1. Navigate to the Sync Data page
2. Click "Sync Data" button to process all data sources
3. View the harmonized results
4. Navigate to Dashboard to see all synchronized data

## How It Works

### Data Normalization

The system processes three mock data sources with different formats:
- **Source A**: Carbon emissions in kilograms
- **Source B**: Scope 1 emissions in tonnes
- **Source C**: CO2 emissions in metric tons

The normalization engine:
1. Detects sustainability-related field names
2. Identifies units of measurement
3. Converts all values to tonnes
4. Aggregates data from all sources
5. Stores unified records in Oracle database

### API Endpoints

- `POST /api/sync` - Synchronize data from all sources
- `GET /api/data` - Retrieve all sustainability records
- `GET /api/data/latest` - Get most recent synchronized data

## Technology Stack

### Frontend
- Angular 16
- TypeScript
- RxJS
- CSS

### Backend
- Node.js
- Express
- Oracle Database (oracledb driver)

## Architecture

The application follows a modular architecture with:
- Lazy-loaded Angular modules
- Service-based API communication
- Middleware pipeline for request processing
- Controller-based business logic
- Database abstraction layer

For detailed architecture information, see `docs/architecture.md`

## Development

### Frontend Development
```bash
cd frontend
npm run watch
```

### Backend Development
```bash
cd backend
npm run dev
```

## License

MIT

