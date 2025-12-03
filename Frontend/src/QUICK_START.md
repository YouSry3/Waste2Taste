# Quick Start Guide - Food Rescue Platform Frontend

## 🚀 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env and set your API URL
# VITE_API_BASE_URL=https://localhost:5001/api
```

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` - You should see the login page!

## 🎯 Quick Navigation

### Current State (Demo Mode)
- ✅ Login page with 3 panel types (Moderation, Corporate, Charity)
- ✅ Any credentials work (no validation)
- ✅ All three panels fully functional with mock data
- ✅ Complete UI/UX implementation

### What Works Now
1. **Login**: Enter any email/password and select a panel
2. **Panel Switching**: Toggle between panels using top navigation
3. **All Features**: Explore dashboards, listings, orders, etc.
4. **Logout**: Click logout button to return to login page

## 📱 Test the Panels

### Moderation Panel
1. Login → Select "Moderation Panel"
2. Try: Dashboard, Listings, Orders, Vendors, Users, Map, Moderation tabs

### Corporate Panel
1. Login → Select "Corporate Panel"
2. Try: Branch selector, Dashboard, Orders, Create Listings, Corporate Control

### Charity Panel
1. Login → Select "Charity Panel"
2. Try: Verification Requests, Approved Users, Product Listings

## 🔌 Connecting to Your ASP.NET Core API

### Step 1: Update API URL
```env
# In .env file
VITE_API_BASE_URL=https://your-api-url.com/api
```

### Step 2: Update Login Page
```typescript
// In /components/auth/LoginPage.tsx

// Remove/comment this:
await new Promise(resolve => setTimeout(resolve, 500));
onLogin(selectedPanel);

// Uncomment this:
const response = await authService.login({
  email,
  password,
  panelType: selectedPanel,
});

if (response.user.panelType !== selectedPanel) {
  throw new Error('Account does not have access to the selected panel');
}

onLogin(selectedPanel);
```

### Step 3: Replace Mock Data with API Calls

**Example - Admin Dashboard:**

```typescript
// Before (mock data):
const stats = {
  totalRevenue: 125000,
  totalOrders: 450,
  // ...
};

// After (API call):
import { adminService } from '@/services/admin/adminService';

const stats = await adminService.getDashboardStats();
```

### Step 4: Configure CORS in ASP.NET Core

```csharp
// In Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("FoodRescue", builder =>
    {
        builder.WithOrigins("http://localhost:5173")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

app.UseCors("FoodRescue");
```

## 🎨 Customization

### Change Branding
```typescript
// In /App.tsx and /components/auth/LoginPage.tsx
// Replace:
<h2>Food Rescue Platform</h2>

// With your brand name
```

### Add New Panel View
1. Create component in `/components/{panel}/`
2. Add to sidebar menu items
3. Add to panel's switch statement
4. Create service method if needed

### Modify Colors
```css
/* In /styles/globals.css */
/* Update CSS variables for your brand colors */
```

## 📚 Project Structure at a Glance

```
├── components/
│   ├── admin/      ← Moderation panel
│   ├── vendor/     ← Corporate panel  
│   ├── charity/    ← Charity panel
│   ├── auth/       ← Login page
│   └── ui/         ← Reusable components
│
├── services/
│   ├── api/        ← API client
│   ├── auth/       ← Authentication
│   ├── admin/      ← Admin API calls
│   └── vendor/     ← Vendor API calls
│
└── types/
    └── models.ts   ← TypeScript types
```

## 🔧 Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint code (if configured)
npm run lint
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config
# Or kill process on port 5173
```

### API Connection Issues
1. Check CORS configuration in backend
2. Verify API_BASE_URL in .env
3. Check browser console for errors
4. Verify backend is running

### TypeScript Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 📖 Next Steps

1. **Read Documentation**
   - `INTEGRATION_GUIDE.md` - Detailed API integration
   - `PROJECT_STRUCTURE.md` - Complete project overview

2. **Implement Backend**
   - Create ASP.NET Core controllers
   - Match endpoint structure in apiConfig.ts
   - Implement authentication

3. **Replace Mock Data**
   - Use service methods instead of hardcoded data
   - Add loading states
   - Handle errors properly

4. **Add Features**
   - File uploads
   - Real-time notifications
   - Advanced filtering
   - Export functionality

## 🎓 Learning Resources

### React + TypeScript
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [React Documentation](https://react.dev/)

### API Integration
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [ASP.NET Core CORS](https://docs.microsoft.com/en-us/aspnet/core/security/cors)

### UI Components
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

## 💡 Pro Tips

1. **Use TypeScript**: Let it catch errors before runtime
2. **Check Console**: Most issues show up in browser console
3. **Read Error Messages**: They usually tell you exactly what's wrong
4. **Start Small**: Get one API endpoint working before doing all
5. **Test Often**: Run the app frequently during development

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Update API_BASE_URL to production URL
- [ ] Remove demo mode from LoginPage
- [ ] Replace all mock data with API calls
- [ ] Add proper error handling
- [ ] Test all features
- [ ] Add loading states
- [ ] Configure production CORS
- [ ] Build and test production bundle
- [ ] Set up environment variables on hosting platform

## 🆘 Need Help?

1. Check the error message in browser console
2. Review `INTEGRATION_GUIDE.md` for API setup
3. Verify your ASP.NET Core API is running
4. Check CORS configuration
5. Ensure authentication tokens are being sent

## 📞 Support Resources

- **Project Documentation**: See `/INTEGRATION_GUIDE.md`
- **Type Definitions**: Check `/types/models.ts`
- **API Examples**: Review service files in `/services/`
- **Component Examples**: Look at existing panel components

---

**Ready to Start?** Run `npm run dev` and open http://localhost:5173 🎉
