import { test, expect } from '@playwright/test';

test('IT-02: DRIVER login state -> REAL Inventory and Cart', {
  annotation: {
    type: 'description',
    description: 'ใช้ Driver เตรียมสถานะ Login เพื่อทดสอบ Inventory และ Cart จริง'
  }
}, async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await test.step('สร้าง Driver และเปิด Inventory', async () => {
    // สร้าง BrowserContext และใช้ driverOpenInventory() ตั้งค่า Cookie
    await context.addCookies([{ name: 'session-username', value: 'standard_user', domain: 'www.saucedemo.com', path: '/' }]);
    await page.goto('https://www.saucedemo.com/inventory.html');
  });

  await test.step('ตรวจสอบ Inventory จริง', async () => {
    // ตรวจสอบสินค้า 6 รายการ
    const items = page.locator('.inventory_item');
    await expect(items).toHaveCount(6);
  });

  await test.step('เพิ่มสินค้า 2 รายการ', async () => {
    // เพิ่ม Backpack และ Bike Light แล้วตรวจสอบ Cart Badge = 2
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
  });

  await test.step('ตรวจสอบสินค้าใน Cart', async () => {
    // เปิด Cart และตรวจสอบชื่อสินค้าทั้งสองรายการ
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('.inventory_item_name').nth(0)).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('.inventory_item_name').nth(1)).toHaveText('Sauce Labs Bike Light');
  });

  // ปิด BrowserContext ที่สร้างเองเมื่อสิ้นสุดการทดสอบ
  await context.close();
});