# Prism Virtual Stain Hub - Test Automation Framework

Automated test suite for the Prism Virtual Stain Hub application using Playwright with TypeScript. This framework implements the Page Object Model (POM) pattern for maintainable and scalable test automation.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm package manager
- Git

### Clone Repository
```bash
# Clone the repository
git clone https://github.com/amargupta22/pictorlabs-automation.git

# Navigate to project directory
cd pictorlabs-automation
```

### Installation
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests
```bash
# Run all tests (headless mode)
npx playwright test

# Run tests in headed mode (watch browser)
npx playwright test --headed

# Run specific test file
npx playwright test tests/dashboard/dashboard-overview.spec.ts

# Run tests with HTML report
npx playwright test --reporter=html

# View last test report
npx playwright show-report
```

## 📁 Project Structure

```
pictorlabs-automation/
├── fixtures/                    # Test data and configuration
│   └── testCredentials.ts      # Centralized test credentials
├── pages/                       # Page Object Model classes
│   ├── BasePage.ts             # Base page with common methods
│   ├── LoginPage.ts            # Login page interactions
│   ├── DashboardPage.ts        # Dashboard page interactions
│   ├── NavigationPage.ts       # Navigation menu interactions
│   ├── ReportsPage.ts          # Reports page interactions
│   ├── StainManagementPage.ts  # Stain management page interactions
│   └── UploadsPage.ts          # Uploads page interactions
├── tests/                       # Test specifications
│   ├── authentication/         # Authentication tests
│   │   └── login.spec.ts
│   ├── dashboard/              # Dashboard tests
│   │   ├── dashboard-overview.spec.ts
│   │   └── dashboard-slides.spec.ts
│   ├── model/                  # Model/Stain management tests
│   │   └── stain-management.spec.ts
│   ├── navigation/             # Navigation tests
│   │   └── navigation.spec.ts
│   ├── reports/                # Reports module tests
│   │   └── reports.spec.ts
│   └── uploads/                # Uploads module tests
│       └── uploads.spec.ts
├── global-setup.ts             # Global setup - handles authentication
├── playwright.config.ts        # Playwright configuration
├── storageState.json           # Saved authentication state
├── package.json                # Project dependencies
└── README.md                   # This file
```

## 🏗️ Framework Architecture

### Page Object Model (POM)
The framework follows the **Page Object Model** design pattern, which provides:
- **Separation of concerns**: Test logic is separated from page interactions
- **Reusability**: Page objects can be reused across multiple tests
- **Maintainability**: Changes to UI only require updates in page objects, not tests
- **Readability**: Tests are more readable and easier to understand

#### Base Page
All page objects extend `BasePage.ts`, which provides:
- Common navigation methods
- Wait utilities
- Error handling
- Screenshot capabilities

Example:
```typescript
export class BasePage {
  constructor(protected page: Page) {}
  
  async open(path: string = '/') {
    await this.page.goto(path);
  }
  
  async waitForElement(selector: string, timeout: number = 10000) {
    await this.page.waitForSelector(selector, { timeout });
  }
}
```

#### Page Objects
Each page object represents a specific page or component:
```typescript
export class DashboardPage extends BasePage {
  // Locators
  private overviewTab = this.page.getByRole('tab', { name: 'Overview' });
  private slidesTab = this.page.getByRole('tab', { name: 'Slides' });
  
  // Actions
  async clickOverviewTab() {
    await this.overviewTab.click();
  }
  
  // Assertions
  async expectOverviewVisible() {
    await expect(this.overviewTab).toBeVisible();
  }
}
```

### Authentication Strategy
The framework uses **global-setup** for efficient authentication:

1. **One-time login**: `global-setup.ts` performs login once before all tests
2. **Storage state**: Authentication cookies/tokens are saved to `storageState.json`
3. **Test reuse**: All tests use saved storage state, skipping login
4. **Session persistence**: Cookies remain valid for 24 hours (JWT token expiration)

**Benefits:**
- ⚡ **Faster test execution**: No repeated logins
- 🔒 **Secure**: Credentials stored in fixtures
- 🎯 **Focused testing**: Tests focus on functionality, not authentication

**When storage state expires:**
```bash
# Delete old storage state
rm storageState.json

# Run any test to trigger global-setup
npx playwright test tests/dashboard/dashboard-overview.spec.ts
```

### Test Organization
Tests are organized by **functional modules**:
- **authentication/**: Login and logout flows
- **dashboard/**: Dashboard overview, slides, and analytics
- **model/**: Stain management and model configuration
- **navigation/**: Main navigation and menu interactions
- **reports/**: Reporting and data exports
- **uploads/**: File upload and validation

Each test file contains **2-3 focused tests** for better organization and maintenance.

## ⚙️ Configuration

### playwright.config.ts
Key configuration settings:
```typescript
{
  globalSetup: './global-setup.ts',      // Run authentication before tests
  testDir: './tests',                     // Test directory location
  fullyParallel: true,                    // Run tests in parallel
  use: {
    baseURL: 'https://development.prism.deepstain.com',
    storageState: 'storageState.json',   // Use saved auth state
    screenshot: 'only-on-failure',        // Capture screenshots on failure
    trace: 'on',                          // Enable trace recording
    video: 'on',                          // Record video
    navigationTimeout: 60000,             // 60s navigation timeout
    actionTimeout: 60000                  // 60s action timeout
  },
  workers: 4,                             // Parallel workers
  reporter: [['html', { open: 'on-failure' }]]
}
```

### Test Credentials
Credentials are centralized in `fixtures/testCredentials.ts`:
```typescript
export const testCredentials = {
  email: 'pictor.newqa.guest5@pictorlabs.ai',
  password: 'c9CgNfFnD6F!kJs'
};
```

## 📝 Writing Tests

### Test Structure
```typescript
import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Dashboard - Overview', () => {
  test('Dashboard displays all overview sections', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    
    await dashboard.open();
    await dashboard.expectOverviewVisible();
    await dashboard.expectSlidesTabVisible();
  });
});
```

## 🧪 Test Coverage

### Modules Tested
| Module | Test Coverage | Files |
|--------|---------------|-------|
| Authentication | Login flow | `login.spec.ts` |
| Dashboard | Overview, Slides, Analytics | `dashboard-overview.spec.ts`, `dashboard-slides.spec.ts` |
| Navigation | Menu navigation, Module switching | `navigation.spec.ts` |
| Reports | Report viewing, Filters | `reports.spec.ts` |
| Stain Management | Model overview, Toggles | `stain-management.spec.ts` |
| Uploads | Upload UI, File restrictions | `uploads.spec.ts` |

### Total Tests: 14
- ✅ All tests passing
- 🔄 Average execution time: ~1.3 minutes (parallel execution)
- 🎯 2-3 focused tests per module

## Test Reports with videos and traces

### View Test Trace
```bash
# Open trace for failed test
npx playwright show-trace test-results/<test-name>/trace.zip
```

### View HTML Report
```bash
# Generate and view report
npx playwright show-report
```

## 👥 Maintenance

### Adding New Tests
1. Create page object in `pages/` if needed
2. Add test file in appropriate `tests/` subdirectory
3. Follow naming convention: `<module-name>.spec.ts`
4. Keep tests focused (2-3 tests per file)

### Updating Page Objects
When UI changes:
1. Update locators in relevant page object
2. Run affected tests to verify
3. Update assertions if needed

### Credentials Rotation
To update test credentials:
1. Edit `fixtures/testCredentials.ts`
2. Delete `storageState.json`
3. Run any test to regenerate storage state

---