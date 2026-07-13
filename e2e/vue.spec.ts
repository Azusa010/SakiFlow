import { test, expect } from '@playwright/test'

test('用户登录后应进入工作台', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear()
  })

  await page.goto('/login')
  await expect(page.getByRole('heading', {name:'SakiFlow'})).toBeVisible()

  await page.getByPlaceholder('请输入用户名').fill('测试用户')
  await page.getByPlaceholder('请输入密码').fill('123456')

  await page.getByRole('button',{name:'登录',exact:true}).click()

  await expect(page).toHaveURL(/\/dashboard$/)

  await expect(page.getByRole('heading', {name:'你好,测试用户'})).toBeVisible()
})
