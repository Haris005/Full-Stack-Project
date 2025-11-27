# Setup Guide - Sustainability Sync Board

## Quick Start Guide

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Oracle Database

1. Update the `.env` file in the backend directory with your Oracle credentials:

```
DB_USER=your_oracle_username
DB_PASSWORD=your_oracle_password
DB_CONNECTION_STRING=localhost:1521/XEPDB1
```

2. Create the database schema by running:

```bash
sqlplus username/password@connection_string @config/schema.sql
```

Or manually execute the SQL commands:

```sql
CREATE TABLE sustainability_data (
  id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  metric VARCHAR2(100) NOT NULL,
  value_tonnes NUMBER(10,2) NOT NULL,
  source_count NUMBER NOT NULL,
  sources VARCHAR2(500),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sustainability_timestamp ON sustainability_data(timestamp);
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Step 4: Start the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

Expected output: `Server running on port 3000` and `Oracle Database connection pool created`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The application will automatically open at `http://localhost:4200`

## Testing the Application

1. Navigate to `http://localhost:4200`
2. Click on "Sync Data" in the navigation
3. Click the "Sync Data" button
4. Observe the normalization results
5. Navigate to "Dashboard" to see all synchronized data

## Mock Data Sources

The application includes three mock data sources in the `/data` folder:

- **source_a.json** - 120,000 kg carbon emissions
- **source_b.json** - 100 tonnes Scope 1 emissions
- **source_c.json** - 23 metric tons CO2 emissions

**Expected Result:** 243.0 tonnes (120 + 100 + 23)

## Troubleshooting

### Backend won't start
- Verify Oracle database is running
- Check .env credentials are correct
- Ensure the database schema is created

### Frontend shows CORS errors
- Verify backend is running on port 3000
- Check CORS middleware is enabled in server.js

### Database connection errors
- Verify Oracle instant client is installed
- Check connection string format
- Test connection with SQL*Plus first

## Development Mode

For development with auto-reload:

**Backend:**
```bash
npm run dev
```

**Frontend:**
```bash
npm run watch
```

## Production Build

**Frontend:**
```bash
cd frontend
npm run build
```

The build artifacts will be in `dist/sustainability-sync-frontend/`

## Project Structure

```
/frontend
  /src
    /app
      /dashboard          - Dashboard component (lazy loaded)
      /sync              - Sync component (lazy loaded)
      /shared/services   - API services with Observables
    /environments        - Environment configurations
  
/backend
  /routes               - API routing
  /controllers          - Business logic & normalization
  /middleware           - Logger and error handler
  /config               - Database configuration
  
/data                   - Mock JSON data sources
/docs                   - Architecture documentation
```

## Key Features Implemented

- ✅ Angular 16 with TypeScript
- ✅ Lazy loading for Dashboard and Sync modules
- ✅ Reactive programming with RxJS Observables
- ✅ Separate HTML templates (no inline templates)
- ✅ CSS stylesheets (no SCSS)
- ✅ Node.js backend with Express
- ✅ Middleware architecture
- ✅ RESTful API routing
- ✅ Oracle database integration
- ✅ Intelligent data normalization
- ✅ Rule-based unit conversion
- ✅ No comments in code (as requested)
- ✅ Well-designed, aesthetic, reactive UI

## Next Steps

1. Customize Oracle connection settings
2. Run the database schema script
3. Start backend and frontend servers
4. Test the sync functionality
5. View harmonized data on dashboard

For detailed architecture and design decisions, see `/docs/architecture.md`

