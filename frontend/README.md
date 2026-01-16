# HRM Platform - Frontend Dashboard

React-based web dashboard for the HRM Platform.

## 🚀 Tech Stack

- **Framework:** React 18+
- **Language:** TypeScript
- **Build Tool:** Vite
- **UI Library:** Material-UI (MUI)
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod
- **API Client:** Axios
- **Charts:** Recharts

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── api/              # API client & endpoints
│   ├── assets/           # Images, fonts, icons
│   ├── components/       # Reusable components
│   │   ├── common/
│   │   ├── forms/
│   │   └── layouts/
│   ├── features/         # Feature-based modules
│   │   ├── auth/
│   │   ├── employees/
│   │   ├── attendance/
│   │   ├── leave/
│   │   ├── payroll/
│   │   └── dashboard/
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Redux store & slices
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🛠️ Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=HRM Platform
```

### 3. Start Development Server

```bash
npm run dev
```

Application will be available at: http://localhost:3000

## 📦 Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint

# Type checking
npm run type-check

# Testing
npm run test

# Format code
npm run format
```

## 🎨 UI Components

We use Material-UI (MUI) for consistent, professional UI components:

```tsx
import { Button, TextField, Card } from '@mui/material';

function MyComponent() {
  return (
    <Card>
      <TextField label="Employee Name" />
      <Button variant="contained">Save</Button>
    </Card>
  );
}
```

## 🔐 Authentication

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, login, logout } = useAuth();

  const handleLogin = async () => {
    await login({ email: 'user@example.com', password: 'password' });
  };

  return (
    <div>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

## 🗂️ State Management

Using Redux Toolkit:

```tsx
// src/store/slices/employeeSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async () => {
    const response = await api.get('/employees');
    return response.data;
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState: { list: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      });
  },
});
```

## 🌐 API Integration

```tsx
// src/api/employees.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const employeeApi = {
  getAll: () => api.get('/employees'),
  getById: (id: string) => api.get(`/employees/${id}`),
  create: (data: any) => api.post('/employees', data),
  update: (id: string, data: any) => api.put(`/employees/${id}`, data),
  delete: (id: string) => api.delete(`/employees/${id}`),
};
```

## 📋 Forms with Validation

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  firstName: z.string().min(2, 'Too short'),
  email: z.string().email('Invalid email'),
});

function EmployeeForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName')} />
      {errors.firstName && <span>{errors.firstName.message}</span>}
      
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Test production build locally
npm run preview

# Deploy to hosting (Vercel, Netlify, etc.)
# Files in dist/ directory
```

## 🎨 Theming

```tsx
// src/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
  },
});
```

## 📱 Responsive Design

All components are mobile-responsive using MUI's Grid system:

```tsx
import { Grid, Container } from '@mui/material';

function ResponsiveLayout() {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {/* 100% width on mobile, 50% on desktop */}
        </Grid>
        <Grid item xs={12} md={6}>
          {/* ... */}
        </Grid>
      </Grid>
    </Container>
  );
}
```

## 🔧 Environment Variables

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=HRM Platform
VITE_APP_VERSION=1.0.0
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Material-UI](https://mui.com)
- [Redux Toolkit](https://redux-toolkit.js.org)
