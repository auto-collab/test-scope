import { test, expect } from '@playwright/test';

test.describe('Test Details E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for applications to load and select the first one
    await expect(page.getByText('E-Commerce Platform')).toBeVisible({ timeout: 10000 });
    await page.locator('[data-testid="select-input"]').first().selectOption('app1');
    await expect(page.getByText('Main e-commerce application with payment processing')).toBeVisible();
  });

  test('should expand and show test assembly details', async ({ page }) => {
    // Click to show test details
    const showTestDetailsButton = page.getByText('Show Test Details');
    await expect(showTestDetailsButton).toBeVisible();
    await showTestDetailsButton.click();

    // Should show test results by assembly header
    await expect(page.getByText('Test Results by Assembly')).toBeVisible();
    
    // Should show assembly name
    await expect(page.getByText('ECommerce.Tests.dll')).toBeVisible();
    await expect(page.getByText('ECommerce.Tests.Unit')).toBeVisible();
    
    // Should show test counts
    await expect(page.getByText('1 passed')).toBeVisible();
    await expect(page.getByText('1 failed')).toBeVisible();
    await expect(page.getByText('(145 total)')).toBeVisible();
  });

  test('should expand assembly to show individual tests', async ({ page }) => {
    // Show test details first
    await page.getByText('Show Test Details').click();
    await expect(page.getByText('Test Results by Assembly')).toBeVisible();

    // Click on assembly to expand
    const assemblyHeader = page.getByText('ECommerce.Tests.dll');
    await assemblyHeader.click();

    // Should show individual test cases
    await expect(page.getByText('Should calculate total price correctly')).toBeVisible();
    await expect(page.getByText('Should handle inventory updates')).toBeVisible();
    
    // Should show test outcomes
    await expect(page.getByText('passed')).toBeVisible();
    await expect(page.getByText('failed')).toBeVisible();
  });

  test('should expand individual test to show detailed information', async ({ page }) => {
    // Navigate to test details
    await page.getByText('Show Test Details').click();
    await page.getByText('ECommerce.Tests.dll').click();

    // Click on a specific test
    const testHeader = page.getByText('Should handle inventory updates');
    await testHeader.click();

    // Should show detailed test information
    await expect(page.getByText('Test ID:')).toBeVisible();
    await expect(page.getByText('Priority:')).toBeVisible();
    await expect(page.getByText('State:')).toBeVisible();
    await expect(page.getByText('Started:')).toBeVisible();
    await expect(page.getByText('Completed:')).toBeVisible();
    await expect(page.getByText('Test Run:')).toBeVisible();
  });

  test('should show error details for failed tests', async ({ page }) => {
    // Navigate to failed test details
    await page.getByText('Show Test Details').click();
    await page.getByText('ECommerce.Tests.dll').click();
    await page.getByText('Should handle inventory updates').click();

    // Should show error message section
    await expect(page.getByText('Error Message:')).toBeVisible();
    await expect(page.getByText('Expected inventory count to be 0, but was 1')).toBeVisible();
    
    // Should show stack trace section
    await expect(page.getByText('Stack Trace:')).toBeVisible();
    await expect(page.getByText(/at ECommerce.Tests.Unit.InventoryTests/)).toBeVisible();
  });

  test('should not show error details for passed tests', async ({ page }) => {
    // Navigate to passed test details
    await page.getByText('Show Test Details').click();
    await page.getByText('ECommerce.Tests.dll').click();
    await page.getByText('Should calculate total price correctly').click();

    // Should show basic test information
    await expect(page.getByText('Test ID:')).toBeVisible();
    
    // Should NOT show error sections
    await expect(page.getByText('Error Message:')).not.toBeVisible();
    await expect(page.getByText('Stack Trace:')).not.toBeVisible();
  });

  test('should collapse test details when clicked again', async ({ page }) => {
    // Expand test details
    await page.getByText('Show Test Details').click();
    await expect(page.getByText('Test Results by Assembly')).toBeVisible();

    // Collapse test details
    await page.getByText('Hide Test Details').click();
    await expect(page.getByText('Test Results by Assembly')).not.toBeVisible();
  });

  test('should collapse assembly when clicked again', async ({ page }) => {
    // Expand test details and assembly
    await page.getByText('Show Test Details').click();
    await page.getByText('ECommerce.Tests.dll').click();
    await expect(page.getByText('Should calculate total price correctly')).toBeVisible();

    // Collapse assembly
    await page.getByText('ECommerce.Tests.dll').click();
    await expect(page.getByText('Should calculate total price correctly')).not.toBeVisible();
  });

  test('should collapse individual test when clicked again', async ({ page }) => {
    // Expand everything
    await page.getByText('Show Test Details').click();
    await page.getByText('ECommerce.Tests.dll').click();
    await page.getByText('Should calculate total price correctly').click();
    await expect(page.getByText('Test ID:')).toBeVisible();

    // Collapse individual test
    await page.getByText('Should calculate total price correctly').click();
    await expect(page.getByText('Test ID:')).not.toBeVisible();
  });

  test('should show correct test durations', async ({ page }) => {
    // Expand to see test durations
    await page.getByText('Show Test Details').click();
    await page.getByText('ECommerce.Tests.dll').click();

    // Should show duration in appropriate format
    await expect(page.getByText('45ms')).toBeVisible(); // Short duration in ms
    await expect(page.getByText('0.08s')).toBeVisible(); // Longer duration in seconds
  });

  test('should show test outcome badges with correct styling', async ({ page }) => {
    // Expand to see test outcomes
    await page.getByText('Show Test Details').click();
    await page.getByText('ECommerce.Tests.dll').click();

    // Check passed test badge
    const passedBadge = page.locator('text=passed').first();
    await expect(passedBadge).toBeVisible();
    await expect(passedBadge).toHaveClass(/text-green-600/);
    await expect(passedBadge).toHaveClass(/bg-green-100/);

    // Check failed test badge
    const failedBadge = page.locator('text=failed').first();
    await expect(failedBadge).toBeVisible();
    await expect(failedBadge).toHaveClass(/text-red-600/);
    await expect(failedBadge).toHaveClass(/bg-red-100/);
  });

  test('should handle multiple assemblies if present', async ({ page }) => {
    // This test assumes the mock data might have multiple assemblies
    await page.getByText('Show Test Details').click();
    
    // Should handle the test assembly that exists
    await expect(page.getByText('ECommerce.Tests.dll')).toBeVisible();
    
    // Check that the assembly count display works
    await expect(page.getByText('(145 total)')).toBeVisible();
  });

  test('should show proper test run information', async ({ page }) => {
    // Expand to test details
    await page.getByText('Show Test Details').click();
    await page.getByText('ECommerce.Tests.dll').click();
    await page.getByText('Should calculate total price correctly').click();

    // Should show test run information
    await expect(page.getByText('CI/CD Pipeline Run')).toBeVisible();
    await expect(page.getByText('#12345')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Expand test details
    await page.getByText('Show Test Details').click();
    await expect(page.getByText('Test Results by Assembly')).toBeVisible();

    // Should still be able to expand assembly
    await page.getByText('ECommerce.Tests.dll').click();
    await expect(page.getByText('Should calculate total price correctly')).toBeVisible();

    // Test details should be readable on mobile
    await page.getByText('Should calculate total price correctly').click();
    await expect(page.getByText('Test ID:')).toBeVisible();
  });

  test('should handle keyboard navigation in test details', async ({ page }) => {
    // Expand test details
    await page.getByText('Show Test Details').click();
    await expect(page.getByText('Test Results by Assembly')).toBeVisible();

    // Use keyboard to navigate to assembly
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Assembly should be focusable and clickable with keyboard
    const assemblyHeader = page.getByText('ECommerce.Tests.dll');
    await assemblyHeader.focus();
    await page.keyboard.press('Enter');
    
    await expect(page.getByText('Should calculate total price correctly')).toBeVisible();
  });

  test('should maintain state when switching between applications', async ({ page }) => {
    // Expand test details for first app
    await page.getByText('Show Test Details').click();
    await expect(page.getByText('Test Results by Assembly')).toBeVisible();

    // Switch to different application
    await page.locator('[data-testid="select-input"]').first().selectOption('app2');
    await expect(page.getByText('Microservice for user authentication and authorization')).toBeVisible();

    // Test details should be collapsed/hidden for new application
    await expect(page.getByText('Test Results by Assembly')).not.toBeVisible();

    // Switch back to first application
    await page.locator('[data-testid="select-input"]').first().selectOption('app1');
    await expect(page.getByText('Main e-commerce application with payment processing')).toBeVisible();

    // Test details should be collapsed again
    await expect(page.getByText('Test Results by Assembly')).not.toBeVisible();
    await expect(page.getByText('Show Test Details')).toBeVisible();
  });
});
