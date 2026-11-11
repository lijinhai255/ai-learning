import { expect, test } from '@playwright/test';

test.describe('Todo 应用主流程', () => {
  test('通过主流程新增、完成并删除待办', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('main')).toBeVisible();

    const input = page.getByRole('textbox', { name: '新待办' });
    await input.fill('验证自动验收');
    await page.getByRole('button', { name: '添加' }).click();

    const createdTodo = page.getByRole('listitem').filter({ hasText: '验证自动验收' });
    await expect(createdTodo).toBeVisible();
    await createdTodo.getByRole('checkbox').check();
    await expect(createdTodo.getByText('验证自动验收')).toHaveClass(/completed/);
    await createdTodo.getByRole('button', { name: '删除' }).click();
    await expect(createdTodo).toBeHidden();
  });
});
