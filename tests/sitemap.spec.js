import { expect, test } from "@playwright/test";
import { RECENTS } from "../recents.js";
import { crawlablePages } from "../journalRoutes.js";
import { readTrips } from "../scripts/readTrips.mjs";

const pages = crawlablePages({ trips: readTrips(), recents: RECENTS });

test.describe("sitemap and robots", () => {
  test("vite preview serves every crawlable loc at /travel/sitemap.xml", async ({ request }) => {
    const res = await request.get("/travel/sitemap.xml");
    expect(res.status()).toBe(200);
    const type = res.headers()["content-type"] || "";
    expect(type).toMatch(/xml/i);
    const body = await res.text();
    expect(body).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(body).not.toContain("#");
    const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(locs).toEqual(pages.map((page) => page.loc));
    for (const loc of locs) {
      expect(loc.startsWith("https://jainfam.net/travel/")).toBe(true);
    }
  });

  test("robots.txt under /travel/ points at the /travel/ sitemap", async ({ request }) => {
    const res = await request.get("/travel/robots.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("Sitemap: https://jainfam.net/travel/sitemap.xml");
    expect(body).not.toMatch(/Sitemap:\s*https:\/\/jainfam\.net\/sitemap\.xml\s*$/m);
  });
});

test.describe("prerendered shells", () => {
  test("trip, recents, and entry HTML differ without executing React", async ({ request }) => {
    const home = await (await request.get("/travel/")).text();
    const merida = await (await request.get("/travel/merida")).text();
    const meridaSlash = await (await request.get("/travel/merida/")).text();
    const recents = await (await request.get("/travel/recents")).text();
    const entry = await (await request.get("/travel/recents/hancock-water-tower-skylight")).text();

    expect(home).toContain("<title>Elsewhere, by Ripul Jain</title>");
    expect(merida).toContain("<title>Mérida — Elsewhere</title>");
    expect(meridaSlash).toContain("<title>Mérida — Elsewhere</title>");
    expect(merida).toContain('href="https://jainfam.net/travel/merida"');
    expect(recents).toContain("<title>Recents — Elsewhere</title>");
    expect(entry).toContain("875 North Michigan Avenue");
    expect(entry).toContain('href="https://jainfam.net/travel/recents/hancock-water-tower-skylight"');
    for (const html of [home, merida, recents, entry]) {
      expect(html).toContain("G-1P8LT831MG");
      expect(html).not.toContain("#merida");
      expect(html).not.toContain("#recents");
    }
    expect(home).not.toContain("<title>Mérida — Elsewhere</title>");
    expect(merida).not.toContain("<title>Recents — Elsewhere</title>");
  });
});

test.describe("legacy hash routes", () => {
  test("trip, recents index, and recent entry hashes land on path URLs", async ({ page }) => {
    await page.goto("/travel/#merida");
    await expect(page).toHaveURL(/\/travel\/merida\/?$/);
    await expect(page.locator("h1")).toHaveText("Mérida");

    await page.goto("/travel/#recents");
    await expect(page).toHaveURL(/\/travel\/recents\/?$/);
    await expect(page.locator("h1")).toHaveText("Recent Photos");

    await page.goto("/travel/#recents/hancock-water-tower-skylight");
    await expect(page).toHaveURL(/\/travel\/recents\/hancock-water-tower-skylight\/?$/);
    await expect(page.getByText("875 North Michigan Avenue", { exact: false })).toBeVisible();
  });

  test("destination cards are real path links", async ({ page }) => {
    await page.goto("/travel/");
    const hrefs = await page.locator("a.trip-card").evaluateAll((els) =>
      els.map((el) => el.getAttribute("href"))
    );
    expect(hrefs).toContain("/travel/merida");
    expect(hrefs).toContain("/travel/rocky-mountain-national-park");
    await expect(page.locator('a[href="/travel/recents"]').first()).toBeVisible();
  });
});
