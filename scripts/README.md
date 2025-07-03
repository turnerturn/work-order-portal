# Mock Data Generator

This script generates realistic pool maintenance work orders for the Tulsa, Oklahoma area.

## Usage

```bash
npm run generate-data
```

Or run directly:

```bash
node scripts/generate-mock-data.js
```

## What it generates

The script creates approximately 20 work orders with:

- **New orders** (4): Orders that need initial scheduling
- **This week** (5-6): Orders due in the current week
- **This month** (6-8): Orders due in the current month
- **Overdue** (3-4): Orders that are past due

## Pool Service Types

- Weekly Pool Cleaning
- Bi-Weekly Pool Maintenance
- Monthly Equipment Service
- Filter Replacement
- Chemical Balance Treatment
- Quarterly Deep Clean
- Pool Opening Service (seasonal)

## Locations

Work orders are distributed across the Tulsa metropolitan area including:

- Brookside
- Midtown
- South Tulsa
- Cherry Street
- Bixby
- Pearl District
- Woodland Hills
- Jenks
- Broken Arrow
- And more...

## Data Structure

Each work order includes:
- Unique UUID
- Service name and description
- Tulsa area address
- Historical activity records
- Scheduling information (frequency, next due date)
- Technician assignments
- Service notes

The generated data is saved to `src/data/mockWorkOrders.json` and is immediately ready to use in the application.
