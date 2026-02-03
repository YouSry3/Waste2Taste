# Food Rescue Platform - Frontend Project Structure

## 📋 Overview

This is a React + TypeScript frontend application structured for integration with an ASP.NET Core REST API backend. The application provides three distinct admin panels: Moderation, Corporate (Vendor), and Charity.

## 📁 Directory Structure

```
food-rescue-platform/
│
├── components/                 # React Components
│   ├── admin/                 # Moderation Panel Components
│   │   ├── AdminPanel.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ListingsView.tsx
│   │   ├── OrdersView.tsx
│   │   ├── VendorsView.tsx
│   │   ├── UsersView.tsx
│   │   ├── MapView.tsx
│   │   └── ModerationView.tsx
│   │
│   ├── vendor/                # Corporate Panel Components
│   │   ├── VendorPanel.tsx
│   │   ├── VendorSidebar.tsx
│   │   ├── VendorDashboard.tsx
│   │   ├── VendorOrders.tsx
│   │   ├── MyListings.tsx
│   │   ├── CreateListing.tsx
│   │   ├── create-listing/
│   │   │   ├── index.tsx
│   │   │   ├── types.ts
│   │   │   ├── hooks/
│   │   │   │   └── useImagePreviews.ts
│   │   │   ├── utils/
│   │   │   │   ├── listingSuggestions.ts
│   │   │   │   └── validation.ts
│   │   │   └── components/
│   │   │       ├── ActionsPanel.tsx
│   │   │       ├── BasicInformationSection.tsx
│   │   │       ├── ImageUploadSection.tsx
│   │   │       ├── PageHeader.tsx
│   │   │       ├── PickupDetailsSection.tsx
│   │   │       ├── PrefilledInfoCard.tsx
│   │   │       ├── PricingAvailabilitySection.tsx
│   │   │       └── TipsCard.tsx
│   │   ├── VendorAnalytics.tsx
│   │   ├── CustomerReports.tsx
│   │   └── CorporateControl.tsx
│   │
│   ├── charity/               # Charity Panel Components
│   │   ├── CharityPanel.tsx
│   │   ├── CharitySidebar.tsx
│   │   ├── CharityDashboard.tsx
│   │   ├── VerificationRequests.tsx
│   │   ├── ApprovedUsers.tsx
│   │   ├── FreeListings.tsx
│   │   └── CharityAnalytics.tsx
│   │
│   ├── auth/                  # Authentication Components
│   │   └── LoginPage.tsx
│   │
│   ├── ui/                    # Reusable UI Components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── ... (other UI components)
│   │
│   └── figma/                 # Special Components
│       └── ImageWithFallback.tsx
│
├── services/                  # Business Logic & API Integration
│   ├── api/                   # Core API Layer
│   │   ├── apiClient.ts      # HTTP client with interceptors
│   │   └── apiConfig.ts      # API configuration & endpoints
│   │
│   ├── auth/                  # Authentication Service
│   │   └── authService.ts    # Login, logout, token management
│   │
│   └── admin/                 # Admin Service (example)
│       └── adminService.ts   # Admin API calls
│
├── types/                     # TypeScript Type Definitions
│   └── models.ts             # Data models matching backend DTOs
│
├── styles/                    # Global Styles
│   └── globals.css           # Tailwind CSS & custom styles
│
├── App.tsx                    # Main Application Component
├── .env.example              # Environment variables template
├── INTEGRATION_GUIDE.md      # ASP.NET Core integration guide
├── PROJECT_STRUCTURE.md      # This file
└── package.json              # Dependencies & scripts
```

## 🎯 Key Features

### 1. Moderation Panel (Admin)
- **Dashboard**: Platform overview with key metrics
- **Listings**: All platform listings management
- **Orders**: Transaction management
- **Vendors**: Vendor directory and profiles
- **Users**: User management
- **Map**: Interactive vendor location map
- **Moderation**: 
  - Listing moderation with AI flagging
  - Customer reports
  - Vendor onboarding requests

### 2. Corporate Panel (Vendor)
- **Branch Selection**: Multi-location support
- **Dashboard**: Revenue and performance metrics
- **Orders**: Order processing
- **Listings**: Product listing management
- **Create Listings**: Add new listings
- **Analytics**: Sales analytics
- **Reports**: Customer report handling
- **Corporate Control**: Sub-account management (3+ locations)

### 3. Charity Panel (NGO)
- **Dashboard**: Activity overview
- **Verification Requests**: User verification workflow
- **Approved Users**: Verified user directory
- **Product Listings**: Free food listings
- **Analytics**: Impact metrics

## 🔧 Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Fetch API with custom wrapper
- **State Management**: React Hooks (can integrate React Query/Zustand)

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🔌 API Integration

### Configuration
1. Copy `.env.example` to `.env`
2. Update `VITE_API_BASE_URL` with your ASP.NET Core API URL
3. Configure CORS in your backend

### Using Services

```typescript
// Example: Using admin service
import { adminService } from '@/services/admin/adminService';

async function loadDashboard() {
  const stats = await adminService.getDashboardStats();
  // Use the data...
}
```

### Authentication Flow
1. User enters credentials on LoginPage
2. LoginPage calls `authService.login()`
3. authService stores JWT token
4. apiClient automatically adds token to requests
5. User accesses panel based on their role

## 📝 Type Safety

All data models in `/types/models.ts` provide full TypeScript type safety and should match your ASP.NET Core DTOs:

```typescript
// Frontend
import { Listing, Order } from '@/types/models';

// Backend (C#)
public class ListingDto { ... }
public class OrderDto { ... }
```

## 🎨 UI Components

The project uses shadcn/ui components which are:
- Fully customizable
- Accessible (ARIA compliant)
- Styled with Tailwind CSS
- Located in `/components/ui/`

## 🔐 Authentication

- JWT-based authentication
- Token stored in localStorage
- Automatic token refresh
- Protected routes by panel type

## 📱 Responsive Design

All panels are fully responsive and work on:
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (320px+)

## 🧪 Demo Mode

Currently runs in demo mode:
- No real API calls
- Mock data in components
- Any credentials accepted

To enable production mode:
1. Set up ASP.NET Core backend
2. Update `.env` with API URL
3. Uncomment API integration code in LoginPage.tsx
4. Replace mock data with service calls

## 📚 Documentation

- **INTEGRATION_GUIDE.md**: Detailed ASP.NET Core integration instructions
- **Component Comments**: Each component has inline documentation
- **Service Comments**: API service methods are well-documented

## 🤝 Contributing

When adding new features:
1. Create components in appropriate panel folder
2. Add types to `/types/models.ts`
3. Create service methods in `/services/`
4. Update this documentation

## 📄 File Naming Conventions

- **Components**: PascalCase (e.g., `VendorDashboard.tsx`)
- **Services**: camelCase (e.g., `adminService.ts`)
- **Types**: PascalCase interfaces (e.g., `Listing`, `Order`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_CONFIG`)

## 🔍 Code Organization

- Keep components small and focused
- Use composition over inheritance
- Separate business logic (services) from UI (components)
- Share common UI components in `/components/ui/`
- Type everything with TypeScript

## 📊 State Management

Current: React hooks (useState, useEffect)

Recommended for scaling:
- **Server State**: React Query / TanStack Query
- **Client State**: Zustand or Context API
- **Form State**: React Hook Form

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Output
- Build artifacts in `/dist`
- Optimized and minified
- Ready for serving

### Deployment Options
1. **With ASP.NET Core**: Serve from wwwroot
2. **Separate**: Deploy to Vercel, Netlify, or CDN
3. **Docker**: Containerize with nginx

## 🐛 Debugging

- React DevTools for component debugging
- Network tab for API calls
- Console logs in apiClient for request/response
- TypeScript for compile-time error catching

## ⚙️ Environment Variables

```env
VITE_API_BASE_URL=https://localhost:5001/api
VITE_ENABLE_MOCK_DATA=false
```

See `.env.example` for full list.

## 📞 Support

For questions or issues:
1. Check INTEGRATION_GUIDE.md
2. Review inline code comments
3. Check TypeScript errors
4. Verify API endpoint configuration

---

**Last Updated**: December 2, 2025
**Version**: 1.0.0
