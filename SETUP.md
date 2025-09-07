# 🚀 Test Scope Dashboard - Production Setup

## Quick Setup (3 steps)

### 1. **Configure Your Applications**

Edit `app/config/applications.ts` and replace the placeholder values:

```typescript
export const APPLICATION_CONFIGS: ApplicationConfig[] = [
  {
    id: 'my-web-app',
    name: 'My Web Application',
    description: 'Frontend and API for our main product',
    projectId: 'MyWebProject', // 🔴 Your Azure DevOps project name
    pipelines: [
      {
        id: 42, // 🔴 Your build definition ID
        name: 'CI/CD Pipeline',
        type: 'build',
        buildFilter: {
          branchName: 'main',
          maxBuilds: 1
        }
      }
    ]
  }
  // Add more applications as needed...
];
```

### 2. **Get Your Azure DevOps Values**

#### **Project ID:**
1. Go to your Azure DevOps organization
2. Navigate to your project
3. Look at the URL: `https://dev.azure.com/{org}/{PROJECT_ID}/_build`
4. Use the `PROJECT_ID` from the URL

#### **Pipeline Names:**
1. Go to **Pipelines** in your Azure DevOps project
2. Copy the exact name of each pipeline you want to monitor
3. The system will automatically find the pipeline and get the latest build
4. Example names: `"CI/CD Pipeline"`, `"Frontend Build"`, `"E2E Tests"`

### 3. **Configure Azure DevOps Connection**

When you run the app, you'll be prompted to enter:
- **Organization**: Your Azure DevOps organization name
- **Project**: Your Azure DevOps project name  
- **Personal Access Token**: [Create one here](https://dev.azure.com/{your-org}/_usersSettings/tokens)

#### **Personal Access Token Permissions:**
Your token needs these scopes:
- ✅ **Build (Read)**
- ✅ **Test Management (Read)**
- ✅ **Code (Read)** - for coverage data

## 🎯 That's It!

Once configured, the dashboard will:
- ✅ Fetch real pipeline data from Azure DevOps
- ✅ Display test results and coverage from your actual builds
- ✅ Show pipeline health and quality gates
- ✅ Update with live data when you refresh

## 📁 File Structure

```
app/
├── config/
│   └── applications.ts     # 🔧 Your application configuration
├── services/
│   └── azure-devops-service.ts  # API integration (no changes needed)
├── contexts/
│   └── azure-devops-context.tsx  # State management (no changes needed)
└── components/             # UI components (no changes needed)
```

## 🔧 Advanced Configuration

### Multiple Projects
```typescript
export const APPLICATION_CONFIGS: ApplicationConfig[] = [
  {
    id: 'frontend-app',
    projectId: 'MyFrontendProject',
    pipelines: [
      { name: 'Build & Test', type: 'build' },
      { name: 'E2E Tests', type: 'build' }
    ]
  },
  {
    id: 'backend-api',
    projectId: 'MyBackendProject', 
    pipelines: [
      { name: 'API Tests', type: 'build' }
    ]
  }
];
```

### Branch Filtering
```typescript
buildFilter: {
  branchName: 'main',     // Only builds from main branch
  maxBuilds: 5            // Get last 5 builds instead of just 1
}
```

## 🐛 Troubleshooting

**"Configuration issues" error?**
- Check that all `your-*-project-id` placeholders are replaced
- Verify pipeline names match exactly (case-sensitive) with Azure DevOps

**"Failed to connect" error?**
- Verify your Personal Access Token has correct permissions
- Check organization and project names are correct
- Ensure token hasn't expired

**No test data showing?**
- Verify your pipelines actually run tests
- Check that test results are published to Azure DevOps
- Some pipelines may not have coverage data (this is normal)
