import { test, expect } from '@playwright/test';

test('IT-01: top-down REAL Login -> browser-level Inventory STUB', {
  annotation: {
    type: 'description',
    description: 'ทดสอบ Login จริงร่วมกับ Inventory Stub ที่จำลองด้วย page.setContent()'
  }
}, async ({ page }) => {
  await test.step('Login ผ่านหน้าเว็บไซต์จริง', async () => {
    // Login และตรวจสอบ URL inventory.html
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
  await test.step('สร้าง Inventory Stub', async () => {
    // ใช้ page.setContent() แสดง Mock Inventory Ready และสินค้าจำลอง 2 รายการ
    await page.setContent(`
      <div>
        <h1>Mock Inventory Ready</h1>
        <div class="inventory_item">Mock Product 1</div>
        <div class="inventory_item">Mock Product 2</div>
      </div>
    `);
  });
  await test.step('ตรวจสอบผลจาก Stub', async () => {
    // ตรวจสอบข้อความ จำนวน และชื่อสินค้าจำลอง
    await expect(page.locator('h1')).toHaveText('Mock Inventory Ready');
    const items = page.locator('.inventory_item');
    await expect(items).toHaveCount(2);
    await expect(items.nth(0)).toHaveText('Mock Product 1');
    await expect(items.nth(1)).toHaveText('Mock Product 2');
  });
});