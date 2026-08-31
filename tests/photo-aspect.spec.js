import { expect, test } from "@playwright/test";

const EPSILON = 0.02;

async function measurePhotos(page, locator) {
  const count = await locator.count();
  const checked = [];
  const stretched = [];

  for (let i = 0; i < count; i++) {
    const img = locator.nth(i);
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(async () => img.evaluate((el) => el.naturalWidth || 0))
      .toBeGreaterThan(0);

    const info = await img.evaluate((el) => {
      const clientWidth = el.clientWidth;
      const clientHeight = el.clientHeight;
      const naturalWidth = el.naturalWidth;
      const naturalHeight = el.naturalHeight;
      const src = el.currentSrc || el.src;
      if (clientWidth < 16 || clientHeight < 16 || naturalWidth < 1 || naturalHeight < 1) {
        return { skipped: true, src };
      }
      const displayed = clientWidth / clientHeight;
      const natural = naturalWidth / naturalHeight;
      return {
        skipped: false,
        src,
        clientWidth,
        clientHeight,
        naturalWidth,
        naturalHeight,
        displayed,
        natural,
        rel: Math.abs(displayed - natural) / natural,
      };
    });

    if (info.skipped) continue;
    checked.push(info);
    if (info.rel > EPSILON) stretched.push(info);
  }

  return { count, checked, stretched };
}

function failIfStretched(stretched) {
  if (!stretched.length) return;
  const detail = stretched
    .map(
      (img) =>
        `${img.src} displayed ${img.clientWidth}×${img.clientHeight} ` +
        `(ratio ${img.displayed.toFixed(4)}) vs file ${img.naturalWidth}×${img.naturalHeight} ` +
        `(ratio ${img.natural.toFixed(4)})`
    )
    .join("\n");
  throw new Error(`Stretched photo(s):\n${detail}`);
}

test.describe("photo aspect ratio", () => {
  test("Mérida two-column journal keeps natural proportions", async ({ page }) => {
    await page.goto("/travel/#merida");
    await expect(page.locator("h1")).toHaveText("Mérida");

    const pair = page.locator(".pair-grid img");
    await expect(pair.first()).toBeVisible();
    await expect(pair).toHaveCount(6);

    const { checked, stretched } = await measurePhotos(page, pair);
    expect(checked.length, "expected Mérida pair-grid photos to paint").toBeGreaterThanOrEqual(2);
    failIfStretched(stretched);
  });

  test("Guatemala journal photos keep natural proportions", async ({ page }) => {
    await page.goto("/travel/#guatemala");
    await expect(page.locator("h1")).toHaveText("Antigua");

    const photos = page.locator(".photo-journal img");
    await expect(photos.first()).toBeVisible();
    await expect(photos).toHaveCount(17);

    const { checked, stretched } = await measurePhotos(page, photos);
    expect(checked.length, "expected Guatemala journal photos to paint").toBeGreaterThanOrEqual(8);
    failIfStretched(stretched);
  });

  test("Recents feed photos keep natural proportions", async ({ page }) => {
    await page.goto("/travel/#recents");
    await expect(page.locator("h1")).toHaveText("Recent Photos");

    const photos = page.locator(".recents-feed-entry img");
    await expect(photos.first()).toBeVisible();
    await expect(photos).toHaveCount(10);

    const { checked, stretched } = await measurePhotos(page, photos);
    expect(checked.length, "expected recents photos to paint").toBe(10);
    failIfStretched(stretched);
  });

  test("lightbox photo keeps natural proportions", async ({ page }) => {
    await page.goto("/travel/#merida");
    await expect(page.locator(".photo-journal img").first()).toBeVisible();
    await page.locator(".photo-journal img").first().click();

    const photo = page.locator('[role="dialog"] img');
    await expect(photo).toBeVisible();

    const { checked, stretched } = await measurePhotos(page, photo);
    expect(checked.length, "expected lightbox photo to paint").toBe(1);
    failIfStretched(stretched);
  });
});
