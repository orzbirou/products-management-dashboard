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

### Core Features
- Product list with search, status filter, sorting, and pagination
- Create/edit products with form validation
- Delete products with confirmation dialog
- Reactive forms with proper error handling
- Loading states and error messages
- Three product statuses: Active, Inactive, and Draft

### UI/UX Enhancements
- Responsive design with mobile-friendly card layout
- Mobile pagination for better navigation on small screens
- Visual form validation with red borders for invalid fields
- Sticky header with Material Design toolbar
- Progressive table scaling across breakpoints (1200px, 1024px, 900px, 768px, 480px)

### Optional Features
- **URL Query Parameter Persistence**: Filter, search, and pagination state preserved in URL and across navigation
- **Improved Accessibility**: Semantic HTML, proper ARIA labels, keyboard navigation support

## Tech Stack

- Angular 18 standalone components with signals
- Angular Material for UI components and theming
- RxJS for reactive programming and state management
- Facade pattern for centralized state management
- Express.js backend with JSON file storage
- Jasmine/Karma for unit testing (28 passing tests)

## Testing

Run all tests:
```bash
cd client
npm test
```

Run tests in headless mode:
```bash
cd client
npm test -- --include='**/*.spec.ts' --browsers=ChromeHeadless --watch=false
```

Test coverage includes:
- API service with HTTP mocking
- Component behavior and interactions
- Form validation logic
- Facade state management

## Notes

The backend is a simple Express server that persists data to `server/data/products.json`. Not production-ready but sufficient for development/demo purposes.

### Validation
Form validation includes:
- Required fields (name, price, status)
- Length constraints (name: 2-60 characters, description: max 500 characters)
- URL pattern validation for image URLs
- Visual feedback with red borders for invalid fields

### Performance
- Status filter and search work with debounce to avoid excessive queries
- URL query parameters preserve user state across page navigation
- Efficient change detection with OnPush strategy where applicable

### Responsive Design
- Desktop view: Full table with all columns
- Tablet view (< 1200px): Hides description and updated date columns
- Mobile view (< 768px): Switches to card-based layout with pagination
