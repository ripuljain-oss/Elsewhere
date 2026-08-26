import { expect, test } from "@playwright/test";

const ICONS = [
  "/travel/favicon.ico",
  "/travel/favicon-16x16.png",
  "/travel/favicon-32x32.png",
  "/travel/apple-touch-icon.png",
  "/travel/icon-192.png",
];

test.describe("favicon set", () => {
  test("index.html links icons that serve under /travel/", async ({ page, request }) => {
    await page.goto("/travel/");

    await expect(page.locator('link[rel="icon"][href="/travel/favicon.ico"]')).toHaveCount(1);
    await expect(page.locator('link[rel="icon"][href="/travel/favicon-32x32.png"]')).toHaveCount(1);
    await expect(page.locator('link[rel="icon"][href="/travel/favicon-16x16.png"]')).toHaveCount(1);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
      "href",
      "/travel/apple-touch-icon.png"
    );

    for (const path of ICONS) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
      const type = res.headers()["content-type"] || "";
      expect(type, path).toMatch(/image\/(png|x-icon|vnd\.microsoft\.icon|ico)/i);
      const body = await res.body();
      expect(body.byteLength, path).toBeGreaterThan(16);
    }
  });
});
