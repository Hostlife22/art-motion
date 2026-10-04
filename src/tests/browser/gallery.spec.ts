import { test, expect, type Page } from "@playwright/test";
import { sceneTime } from "../../animation/timeline";
async function ready(page: Page) {
  await expect(page.locator(".stage")).toHaveAttribute("aria-busy", "false");
}
async function pixels(page: Page) {
  return page.locator("canvas").evaluate((canvas: HTMLCanvasElement) => {
    const c = canvas.getContext("2d")!,
      { data } = c.getImageData(0, 0, canvas.width, canvas.height);
    let hash = 2166136261,
      colored = 0;
    for (let i = 0; i < data.length; i += 124) {
      hash = Math.imul(hash ^ data[i], 16777619);
      if (data[i + 3] > 0) colored++;
    }
    return { hash, colored };
  });
}
test("all twenty scenes render, change with choreography and seek deterministically", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/?time=6");
  await ready(page);
  const signatures = new Set<number>();
  for (let i = 0; i < 20; i++) {
    const time = sceneTime(i);
    await page.locator("#time").fill(String(Number(time.toFixed(2))));
    await expect(page.locator("output")).toHaveText(
      `${time.toFixed(1)} / 86.9`,
    );
    await page.waitForTimeout(70);
    const a = await pixels(page);
    expect(a.colored).toBeGreaterThan(1000);
    signatures.add(a.hash);
    await page.locator("#time").fill(String(Number((time + 0.2).toFixed(2))));
    await page.waitForTimeout(70);
    expect((await pixels(page)).hash).not.toBe(a.hash);
    await page.locator("#time").fill(String(Number(time.toFixed(2))));
    await page.waitForTimeout(70);
    expect((await pixels(page)).hash).toBe(a.hash);
  }
  expect(signatures.size).toBe(20);
  expect(errors).toEqual([]);
});
test("transport, catalogue, keyboard and hidden controls work", async ({
  page,
}) => {
  await page.goto("/?time=6");
  await ready(page);
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await page.waitForTimeout(200);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  expect(Number(await page.locator("#time").inputValue())).toBeGreaterThan(6);
  await page.getByRole("button", { name: "Overview", exact: true }).click();
  await expect(page.locator("#time")).toHaveValue("84");
  await page.locator("summary").click();
  await page.getByRole("button", { name: /GAME OF DEATH/ }).click();
  await expect(page.locator("#time")).toHaveValue(String(sceneTime(17)));
  await page.getByRole("button", { name: "Hide controls" }).click();
  await expect(page.locator(".controls")).toBeHidden();
  await page.keyboard.press("Escape");
  await expect(page.locator(".controls")).toBeVisible();
  await page.getByRole("button", { name: "Replay", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Pause", exact: true }),
  ).toBeVisible();
});
test("mobile overview and enlarged scenes fit without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?time=84");
  await ready(page);
  await expect(page.locator(".stage")).toHaveClass(/mobile-grid/);
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBe(390);
  await page.locator("#time").fill("71");
  await expect(page.locator(".stage")).not.toHaveClass(/mobile-grid/);
  await page.waitForTimeout(100);
  expect((await pixels(page)).colored).toBeGreaterThan(1000);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});
test("reduced motion starts paused and source video is never requested", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await ready(page);
  await expect(page.locator("#time")).toHaveValue("84");
  await expect(
    page.getByRole("button", { name: "Play", exact: true }),
  ).toBeVisible();
  expect(requests.some((x) => x.endsWith(".mp4"))).toBe(false);
  await expect(page.locator("video")).toHaveCount(0);
});
