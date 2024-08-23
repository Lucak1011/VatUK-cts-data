# cts-data

Parses Vatsim UK CTS booking calendar and outputs a CSV file with the bookings.

## Usage

Requires non-ancient NodeJS, Clone the repo and cd into it, then

install dependencies:

```bash
npm i
```

fetch data for a specific month (YYYY-MM):

```bash
npm run fetch-month 2021-01
```

fetch all data:

```bash
npm run fetch-all
```

All data is saved in the pwd/data directory in the format `YYYY-MM.csv`