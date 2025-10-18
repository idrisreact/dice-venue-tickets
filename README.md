# Dice Events - Take-Home Task

A production-ready React application for browsing and viewing events with clean architecture, multi-currency support, and comprehensive testing.

## Features

### Core Functionality
- ✅ Event search by venue name
- ✅ Paginated event list with "Load More"
- ✅ Detailed event cards with images and pricing
- ✅ Expandable sections (description, lineup, tickets)
- ✅ Responsive grid layout (1-4 columns)

### Advanced Features
- 🌍 **Multi-Currency Support** - Auto-detects currency from venue location (24+ countries)
- 🎨 **Clean Architecture** - Modular components, custom hooks, reusable utilities
- ♿ **Accessibility** - ARIA labels, semantic HTML, keyboard navigation
- ⚡ **Performance** - React Query caching, memoization, optimized renders
- 📱 **Responsive Design** - Mobile-first with Tailwind CSS

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development
- **TailwindCSS v4** for styling
- **React Query** for data fetching and caching
- **Vitest + React Testing Library** for testing

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd dice
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Add your Dice API key to `.env`:
```
VITE_DICE_API_KEY=your_api_key_here
```

4. **Run development server**
```bash
npm run dev
```

5. **Run tests**
```bash
npm test
```

6. **Build for production**
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── EventCard.tsx              # Main event card
│   ├── EventCard/                 # Card sub-components
│   ├── EventList.tsx              # Main list component
│   └── EventList/                 # List sub-components
├── hooks/
│   └── useEventList.ts            # Custom data fetching hook
├── utils/
│   ├── eventHelpers.ts            # Event utilities
│   ├── currencyHelpers.ts         # Currency detection
│   └── truncate-text.ts           # Text utilities
├── services/
│   └── api.ts                     # API client
└── types/
    └── event.ts                   # TypeScript interfaces
```

## Key Technical Decisions

### 1. Component Architecture
- **Small, focused components** (avg 50 lines)
- **Single responsibility** principle
- **Reusable utilities** for shared logic

### 2. Custom Hook Pattern
`useEventList` hook encapsulates:
- Data fetching with React Query
- Pagination logic
- Loading/error states
- Memoized transformations

### 3. Multi-Currency Implementation
Auto-detects currency from venue:
```typescript
// London, UK → "£25.00"
// Paris, France → "25,00 €"
// Toronto, Canada → "CA$35.00"
```

Supports 24+ countries including UK, France, Germany, Spain, Italy, USA, Canada, and more.

### 4. Testing Strategy
**68 tests** covering:
- Pricing logic and currency formatting
- User interactions
- Edge cases and error handling
- Custom hooks

## Code Quality

- ✅ TypeScript strict mode
- ✅ DRY principles
- ✅ Pure utility functions
- ✅ Memoization for performance
- ✅ ARIA labels for accessibility
- ✅ Comprehensive error handling
- ✅ Environment variables for API keys
- ✅ Clean code with no comments

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm run test:coverage
```

## Multi-Currency Feature

Automatically displays prices in the correct currency based on event location:

**Supported Countries:**
- Europe: UK, France, Germany, Spain, Italy, Ireland, etc. (GBP/EUR)
- North America: USA, Canada (USD/CAD)
- Asia-Pacific: Australia, Japan, Singapore (AUD/JPY/SGD)

The system:
1. Extracts country code from venue data
2. Maps to currency and locale
3. Formats using `Intl.NumberFormat`

## Performance Optimizations

- React Query caching (5-min stale time)
- `useMemo` for expensive calculations
- Optimized image URLs with query parameters
- Disabled unnecessary refetches
- Early returns to prevent unnecessary hook calls

## Environment Variables

The application uses environment variables for configuration:

| `VITE_DICE_API_KEY` | Dice API authentication key | Yes |

**Note:** All environment variables must be prefixed with `VITE_` to be exposed to the client in Vite.

## Future Enhancements

Given more time, I would add:
- E2E tests with Playwright
- Virtual scrolling for large lists
- Advanced search filters (date, price, genre)
- Favorite/bookmark functionality
- Calendar integration
