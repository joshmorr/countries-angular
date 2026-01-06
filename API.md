# Mock API Documentation

This project uses [json-server](https://github.com/typicode/json-server) to provide a mock REST API for country data.

## Starting the API Server

### Option 1: Run API server only
```bash
npm run api
```

The API server will start on `http://localhost:3000`

### Option 2: Run both API and Angular dev server
```bash
npm run dev
```

This will start both the json-server API (port 3000) and the Angular development server concurrently.

## API Endpoints

### Get All Countries
```
GET http://localhost:3000/countries
```

Returns an array of all countries.

### Get Country by Alpha3 Code
```
GET http://localhost:3000/countries?alpha3Code=USA
```

Returns an array containing the country with the specified alpha3Code.

### Get Country by Alpha2 Code
```
GET http://localhost:3000/countries?alpha2Code=US
```

Returns an array containing the country with the specified alpha2Code.

### Search Countries
```
GET http://localhost:3000/countries?name_like=America
```

Returns countries where the name contains "America".

### Filter by Region
```
GET http://localhost:3000/countries?region=Europe
```

Returns all countries in the Europe region.

### Combined Queries
```
GET http://localhost:3000/countries?region=Asia&name_like=stan
```

You can combine multiple query parameters to filter results.

## Data Source

The mock API uses the data from `db.json` which contains comprehensive country information including:
- Names and codes (alpha2, alpha3)
- Population and area
- Currencies and languages
- Borders and regional information
- Flags and translations

## Configuration

The json-server is configured via command-line options in `package.json`:
- Port: 3001
- Host: localhost

To modify these settings, edit the `api` script in `package.json`.
