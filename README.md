# Test Scope Dashboard

A comprehensive dashboard for monitoring Azure DevOps pipeline test coverage, quality gates, and overall application health. This project demonstrates modern frontend development practices using Next.js, TypeScript, and Tailwind CSS.

## 🎯 Project Purpose

This dashboard provides visibility into the **test scope** of applications - the coverage of code and health/quality as determined by CI/CD pipeline results. It aggregates test results, quality gate outcomes, and code coverage reports from Azure DevOps pipelines to give you a complete picture of your application's testing health.

## 🏗️ Architecture Overview

### Key Concepts for Learning

This project is designed to teach fundamental frontend development concepts:

1. **Component Architecture**: Reusable, composable UI components
2. **State Management**: React Context for global state
3. **API Integration**: Structured service layer for external APIs
4. **TypeScript**: Strong typing for better development experience
5. **Responsive Design**: Mobile-first approach with Tailwind CSS
6. **Error Handling**: Graceful error states and loading indicators

### Project Structure

```
app/
├── components/           # Reusable UI components
│   ├── metric-box.tsx           # Individual metric display
│   ├── project-selector.tsx     # Application selection dropdown
│   ├── test-scope-dashboard.tsx # Main dashboard layout
│   └── azure-devops-config.tsx  # Configuration form
├── contexts/            # React Context providers
│   └── azure-devops-context.tsx # Global state management
├── services/            # API service layer
│   └── azure-devops-api.ts      # Azure DevOps API integration
├── types/               # TypeScript type definitions
│   └── azure-devops.ts          # Azure DevOps API types
├── globals.css          # Global styles
├── layout.tsx           # Root layout component
└── page.tsx            # Main dashboard page
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Mode

The application runs in **demo mode** with realistic mock data, so you can explore all features immediately without needing Azure DevOps credentials.

### Azure DevOps Integration (Optional)

When you're ready to connect to real Azure DevOps:

1. **Create a Personal Access Token:**
   - Go to Azure DevOps → User Settings → Personal Access Tokens
   - Create a new token with these permissions:
     - Build (Read)
     - Test Management (Read) 
     - Code (Read)
     - Project and Team (Read)

2. **Update the API route:**
   - Modify `app/api/azure-devops/route.ts` to use real API calls
   - The service layer is already structured for easy integration

## 📊 Dashboard Features

### Application Overview
- **Pipeline Health**: Success/failure rates across all pipelines
- **Test Pass Rate**: Overall test success percentage
- **Code Coverage**: Average line, branch, and function coverage
- **Total Tests**: Count of all tests executed

### Pipeline Details
- Individual pipeline status and results
- Test execution statistics
- Code coverage breakdown
- Build timing and duration

### Visual Indicators
- **Color-coded metrics**: Green (healthy), Yellow (warning), Red (critical)
- **Status badges**: Clear pipeline and test status indicators
- **Trend indicators**: Up/down arrows for metric changes

## 🛠️ Technical Implementation

### Component Design Patterns

#### 1. **Compound Components**
```tsx
// MetricBox with multiple display options
<MetricBox
  title="Test Pass Rate"
  value="85.2%"
  status="warning"
  subtitle="342/401 tests"
  trend="up"
  trendValue="+2.1%"
/>
```

#### 2. **Context Pattern for State Management**
```tsx
// Global state accessible throughout the app
const { applications, selectedApplication, setSelectedApplication } = useAzureDevOps();
```

#### 3. **Service Layer Pattern**
```tsx
// Clean separation of API logic
const service = new AzureDevOpsService(config);
const applications = await service.buildApplicationDashboard(projectId);
```

### TypeScript Best Practices

#### 1. **Comprehensive Type Definitions**
```typescript
// Strong typing for external API responses
export interface Build {
  id: number;
  buildNumber: string;
  status: 'none' | 'inProgress' | 'completed' | 'cancelled';
  result: 'none' | 'succeeded' | 'partiallySucceeded' | 'failed';
  // ... more properties
}
```

#### 2. **Generic Interfaces**
```typescript
// Reusable component props
interface MetricBoxProps {
  title: string;
  value: string | number;
  status?: 'success' | 'warning' | 'error' | 'info';
  // ... optional props
}
```

### Styling with Tailwind CSS

#### 1. **Responsive Design**
```tsx
// Mobile-first responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

#### 2. **Conditional Styling**
```tsx
// Dynamic classes based on state
className={`px-3 py-1 rounded-full text-sm font-medium ${
  status === 'success' 
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800'
}`}
```

## 🔧 Development Concepts

### 1. **API Integration**
- **Service Layer**: Centralized API calls with error handling
- **Authentication**: Secure token-based authentication
- **Data Transformation**: Converting API responses to UI-friendly formats

### 2. **State Management**
- **React Context**: Global state without external libraries
- **Local State**: Component-specific state with useState
- **Derived State**: Computed values from existing state

### 3. **Error Handling**
- **Try-Catch Blocks**: Graceful error handling in async operations
- **Error Boundaries**: React error boundary patterns
- **User Feedback**: Clear error messages and loading states

### 4. **Performance Optimization**
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Preventing unnecessary re-renders
- **Efficient Re-renders**: Proper dependency arrays

## 🎨 UI/UX Design Principles

### 1. **Information Hierarchy**
- Clear visual hierarchy with typography scales
- Logical grouping of related information
- Progressive disclosure of detailed information

### 2. **Accessibility**
- Semantic HTML structure
- ARIA labels for screen readers
- Keyboard navigation support
- Color contrast compliance

### 3. **Responsive Design**
- Mobile-first approach
- Flexible grid layouts
- Scalable typography
- Touch-friendly interactions

## 🚀 Next Steps for Learning

### Beginner Concepts
1. **Component Composition**: Learn how to build complex UIs from simple components
2. **Props and State**: Understand data flow in React applications
3. **Event Handling**: Learn how to respond to user interactions
4. **CSS Grid and Flexbox**: Master modern CSS layout techniques

### Intermediate Concepts
1. **Context API**: Understand global state management patterns
2. **Custom Hooks**: Learn to extract and reuse stateful logic
3. **TypeScript Generics**: Advanced type system features
4. **API Integration**: Best practices for external data fetching

### Advanced Concepts
1. **Performance Optimization**: React.memo, useMemo, useCallback
2. **Testing**: Unit tests, integration tests, and testing patterns
3. **State Management Libraries**: Redux, Zustand, or Jotai
4. **Build Optimization**: Code splitting, lazy loading, and bundle analysis

## 📚 Learning Resources

### React Fundamentals
- [React Official Tutorial](https://react.dev/learn)
- [React Patterns](https://reactpatterns.com/)
- [React Hooks Guide](https://reactjs.org/docs/hooks-intro.html)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React + TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### CSS and Styling
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

### Azure DevOps
- [Azure DevOps REST API](https://learn.microsoft.com/en-us/rest/api/azure/devops/)
- [Personal Access Tokens](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-authenticate)

## 🤝 Contributing

This is a learning project! Feel free to:
- Add new features
- Improve existing components
- Fix bugs
- Enhance documentation
- Suggest improvements

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed for your learning journey.