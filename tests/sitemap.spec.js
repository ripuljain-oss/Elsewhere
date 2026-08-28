import { expect, test } from "@playwright/test";

test.describe("sitemap and robots", () => {
  test("vite preview serves a urlset at /travel/sitemap.xml", async ({ request }) => {
    const res = await request.get("/travel/sitemap.xml");
    expect(res.status()).toBe(200);
    const type = res.headers()["content-type"] || "";
    expect(type).toMatch(/xml/i);
    const body = await res.text();
    expect(body).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(body).toContain("<loc>https://jainfam.net/travel/</loc>");
    expect(body).not.toContain("#");
    expect((body.match(/<loc>/g) || []).length).toBe(1);
  });

  test("robots.txt under /travel/ points at the /travel/ sitemap", async ({ request }) => {
    const res = await request.get("/travel/robots.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("Sitemap: https://jainfam.net/travel/sitemap.xml");
    expect(body).not.toMatch(/Sitemap:\s*https:\/\/jainfam\.net\/sitemap\.xml\s*$/m);
  });
});
