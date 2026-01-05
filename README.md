# Product Management Dashboard

Angular application for managing product catalog with CRUD operations.

## Setup

Requirements:
- Node.js 18+
- npm

Install dependencies:
```bash
npm install
cd client && npm install
cd ..
```

## Running the Application

Start the backend server:
```bash
npm start
```

Start the Angular dev server (in a separate terminal):
```bash
cd client
npm start
```

The app runs at `http://localhost:4200`, backend at `http://localhost:3000`.

## Project Structure

```
client/src/app/features/products/
  ├── data-access/       - API service and models
  ├── pages/             - Smart components (list, create, edit)
  ├── state/             - Facade for state management
  └── ui/                - Reusable form component
```

## Features

- Product list with search, status filter, sorting, and pagination
- Create/edit products with form validation
- Delete products with confirmation
- Reactive forms with proper error handling
- Loading states and error messages

## Tech Stack

- Angular 18 standalone components
- Angular Material for UI
- RxJS for reactive programming
- Express.js backend with JSON file storage

## Testing

Run tests:
```bash
cd client
npm test
```

## Notes

The backend is a simple Express server that persists data to `server/data/products.json`. Not production-ready but sufficient for development/demo purposes.

Form validation includes required fields, length constraints, and URL pattern validation. Status filter and search work with debounce to avoid excessive queries.
