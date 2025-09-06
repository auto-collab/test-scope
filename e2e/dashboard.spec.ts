import { test, expect } from '@playwright/test';

test.describe('Test Scope Dashboard E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load dashboard with correct title and header', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Test Scope/);

    // Check main header
    await expect(page.getByRole('heading', { name: 'Test Scope Dashboard' })).toBeVisible();
    
    // Check description
    await expect(page.getByText('Monitor test coverage, quality gates, and pipeline health')).toBeVisible();
  });

  test('should show setup guide and allow toggling', async ({ page }) => {
    // Check setup guide is visible
    await expect(page.getByText('🔧 Azure DevOps Integration Setup')).toBeVisible();
    await expect(page.getByText('Demo Mode')).toBeVisible();

    // Toggle setup guide
    await page.getByText('Show Integration Guide').click();
    
    // Check all steps are visible
    await expect(page.getByText('Step 1: Create Personal Access Token')).toBeVisible();
    await expect(page.getByText('Step 2: Enable Real Integration')).toBeVisible();
    await expect(page.getByText('Step 3: Configure Your Organization')).toBeVisible();
    await expect(page.getByText('Step 4: Test the Integration')).toBeVisible();

    // Hide setup guide
    await page.getByText('Hide Integration Guide').click();
    await expect(page.getByText('Step 1: Create Personal Access Token')).not.toBeVisible();
  });

  test('should load applications and allow selection', async ({ page }) => {
    // Wait for applications to load
    await expect(page.getByText('E-Commerce Platform')).toBeVisible({ timeout: 10000 });
    
    // Check dropdown has applications
    const dropdown = page.locator('[data-testid="mock-select"]').first();
    await expect(dropdown).toBeVisible();
    
    // Select an application
    const select = page.locator('[data-testid="select-input"]').first();
    await select.selectOption('app1');
    
    // Should show dashboard for selected application
    await expect(page.getByText('Main e-commerce application with payment processing')).toBeVisible();
    await expect(page.getByText('Healthy')).toBeVisible();
  });

  test('should display metrics correctly for selected application', async ({ page }) => {
    // Wait for applications to load and select one
    await expect(page.getByText('E-Commerce Platform')).toBeVisible({ timeout: 10000 });
    await page.locator('[data-testid="select-input"]').first().selectOption('app1');
    
    // Check metrics are displayed
    await expect(page.getByText('Pipeline Health')).toBeVisible();
    await expect(page.getByText('Test Pass Rate')).toBeVisible();
    await expect(page.getByText('Code Coverage')).toBeVisible();
    await expect(page.getByText('Total Tests')).toBeVisible();
    
    // Check specific metric values
    await expect(page.getByText('2/2')).toBeVisible(); // Pipeline health
    await expect(page.getByText('97.1%')).toBeVisible(); // Test pass rate
    await expect(page.getByText('334')).toBeVisible(); // Total tests
  });

  test('should show pipeline details', async ({ page }) => {
    // Wait for applications and select one
    await expect(page.getByText('E-Commerce Platform')).toBeVisible({ timeout: 10000 });
    await page.locator('[data-testid="select-input"]').first().selectOption('app1');
    
    // Check pipeline details section
    await expect(page.getByText('Pipeline Details')).toBeVisible();
    await expect(page.getByText('CI/CD Pipeline')).toBeVisible();
    await expect(page.getByText('Security Scan Pipeline')).toBeVisible();
    
    // Check pipeline status badges
    await expect(page.getByText('success')).toBeVisible();
  });

  test('should expand and collapse test details', async ({ page }) => {
    // Wait for applications and select one
    await expect(page.getByText('E-Commerce Platform')).toBeVisible({ timeout: 10000 });
    await page.locator('[data-testid="select-input"]').first().selectOption('app1');
    
    // Find and click test details toggle
    const testDetailsToggle = page.getByText('Show Test Details');
    await expect(testDetailsToggle).toBeVisible();
    await testDetailsToggle.click();
    
    // Check test details are shown
    await expect(page.getByText('Test Results by Assembly')).toBeVisible();
    await expect(page.getByText('ECommerce.Tests.dll')).toBeVisible();
    
    // Hide test details
    await page.getByText('Hide Test Details').click();
    await expect(page.getByText('Test Results by Assembly')).not.toBeVisible();
  });

  test('should handle application switching', async ({ page }) => {
    // Wait for applications to load
    await expect(page.getByText('E-Commerce Platform')).toBeVisible({ timeout: 10000 });
    
    const select = page.locator('[data-testid="select-input"]').first();
    
    // Select healthy application
    await select.selectOption('app1');
    await expect(page.getByText('Healthy')).toBeVisible();
    await expect(page.getByText('Main e-commerce application with payment processing')).toBeVisible();
    
    // Switch to warning application
    await select.selectOption('app2');
    await expect(page.getByText('Warning')).toBeVisible();
    await expect(page.getByText('Microservice for user authentication and authorization')).toBeVisible();
    
    // Switch to critical application
    await select.selectOption('app3');
    await expect(page.getByText('Critical')).toBeVisible();
    await expect(page.getByText('Real-time analytics and reporting dashboard')).toBeVisible();
  });

  test('should show no application selected state initially', async ({ page }) => {
    // Should show no selection message
    await expect(page.getByText('No Application Selected')).toBeVisible();
    await expect(page.getByText('Choose an application from the dropdown above')).toBeVisible();
    
    // Should show dashboard icon
    const icon = page.locator('svg').first();
    await expect(icon).toBeVisible();
  });

  test('should handle refresh button', async ({ page }) => {
    // Wait for page to load
    await expect(page.getByText('Test Scope Dashboard')).toBeVisible();
    
    // Click refresh button
    const refreshButton = page.getByText('Refresh');
    await expect(refreshButton).toBeVisible();
    await refreshButton.click();
    
    // Page should reload (we can't easily test the actual reload, but button should be clickable)
    await expect(refreshButton).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check header is still visible
    await expect(page.getByText('Test Scope Dashboard')).toBeVisible();
    
    // Wait for applications and select one
    await expect(page.getByText('E-Commerce Platform')).toBeVisible({ timeout: 10000 });
    await page.locator('[data-testid="select-input"]').first().selectOption('app1');
    
    // Check metrics are displayed (should stack vertically on mobile)
    await expect(page.getByText('Pipeline Health')).toBeVisible();
    await expect(page.getByText('Test Pass Rate')).toBeVisible();
    await expect(page.getByText('Code Coverage')).toBeVisible();
    await expect(page.getByText('Total Tests')).toBeVisible();
  });

  test('should display correct status colors', async ({ page }) => {
    // Wait for applications to load
    await expect(page.getByText('E-Commerce Platform')).toBeVisible({ timeout: 10000 });
    
    const select = page.locator('[data-testid="select-input"]').first();
    
    // Test healthy application - should have green status
    await select.selectOption('app1');
    const healthyBadge = page.getByText('Healthy');
    await expect(healthyBadge).toBeVisible();
    await expect(healthyBadge).toHaveClass(/bg-green-100/);
    
    // Test warning application - should have yellow status
    await select.selectOption('app2');
    const warningBadge = page.getByText('Warning');
    await expect(warningBadge).toBeVisible();
    await expect(warningBadge).toHaveClass(/bg-yellow-100/);
    
    // Test critical application - should have red status
    await select.selectOption('app3');
    const criticalBadge = page.getByText('Critical');
    await expect(criticalBadge).toBeVisible();
    await expect(criticalBadge).toHaveClass(/bg-red-100/);
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Wait for page to load
    await expect(page.getByText('Test Scope Dashboard')).toBeVisible();
    
    // Tab through interactive elements
    await page.keyboard.press('Tab'); // Setup guide toggle
    await page.keyboard.press('Tab'); // Application selector
    await page.keyboard.press('Tab'); // Refresh button
    
    // Should be able to activate refresh button with Enter
    await page.keyboard.press('Enter');
    
    // Page should still be functional
    await expect(page.getByText('Test Scope Dashboard')).toBeVisible();
  });

  test('should show loading states correctly', async ({ page }) => {
    // Initially might show loading
    const loadingText = page.getByText('Loading applications...');
    
    // Either loading is shown initially, or applications load quickly
    try {
      await expect(loadingText).toBeVisible({ timeout: 1000 });
      // If loading was shown, wait for it to disappear
      await expect(loadingText).not.toBeVisible({ timeout: 10000 });
    } catch {
      // Loading might not appear if data loads very quickly
    }
    
    // Eventually applications should be loaded
    await expect(page.getByText('E-Commerce Platform')).toBeVisible({ timeout: 10000 });
  });
});
