#!/usr/bin/env python3
"""Capture screenshots from the running app using Playwright."""

import asyncio
from playwright.async_api import async_playwright

SCREENSHOTS_DIR = "/workspaces/process-_mining_capability/screenshots"
BASE_URL = "http://localhost:3000"


async def capture():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1280, "height": 900})

        # 1. Overview tab (full page)
        await page.goto(BASE_URL)
        await page.wait_for_timeout(3000)
        await page.screenshot(path=f"{SCREENSHOTS_DIR}/01-overview.png", full_page=True)
        print("✓ 01-overview.png")

        # 2. Scroll to trend chart area
        await page.evaluate("window.scrollTo(0, 700)")
        await page.wait_for_timeout(500)
        await page.screenshot(path=f"{SCREENSHOTS_DIR}/02-trend-chart.png")
        print("✓ 02-trend-chart.png")

        # 3. Process Flow tab
        await page.evaluate("window.scrollTo(0, 0)")
        await page.click("button:text('Process Flow')")
        await page.wait_for_timeout(2000)
        await page.screenshot(path=f"{SCREENSHOTS_DIR}/03-process-flow.png", full_page=True)
        print("✓ 03-process-flow.png")

        # 4. Cases tab
        await page.click("button:text('Cases')")
        await page.wait_for_timeout(2000)
        await page.evaluate("window.scrollTo(0, 0)")
        await page.screenshot(path=f"{SCREENSHOTS_DIR}/04-cases-table.png", full_page=True)
        print("✓ 04-cases-table.png")

        # 5. Click first data row for case detail modal
        rows = page.locator("[role='row']")
        count = await rows.count()
        if count > 2:
            await rows.nth(2).click()
            await page.wait_for_timeout(1500)
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/05-case-detail.png")
            print("✓ 05-case-detail.png")

        await browser.close()
        print("All screenshots captured.")


asyncio.run(capture())
