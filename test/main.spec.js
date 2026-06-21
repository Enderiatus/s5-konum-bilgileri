import axios from "axios";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }, testInfo) => {
  // Her test öncesi data çekiyoruz
  const ipResponse = await axios.get("https://api.ipify.org");
  const ipAdresim = ipResponse.data;
  const geoResponse = await axios.get(
    `http://ip-api.com/json/${ipAdresim}?fields=status,message,country,countryCode,city,zip,lat,lon,timezone,currency,isp,query`,
  );
  testInfo.data = geoResponse.data;
  testInfo.data["sorgu"] = ipAdresim;

  await page.goto("http://localhost:3003");
});

test("div.card elementi var mı?", async ({ page }) => {
  const card = page.locator(".card");
  await expect(card).toBeVisible();
});

test("ülke bayrağı doğru şekilde eklenmiş mi?", async ({ page }, testInfo) => {
  const img = page.locator(".card img");
  const expectedImgSrc = `https://flaglog.com/codes/standardized-rectangle-120px/${testInfo.data.countryCode}.png`;
  await expect(img).toHaveAttribute("src", expectedImgSrc);
});

test("div.card-info elementi var mı?", async ({ page }) => {
  const cardInfo = page.locator(".card-info");
  await expect(cardInfo).toBeVisible();
});

test("ip adresi doğru şekilde h3 tagi ile eklenmiş mi?", async ({
  page,
}, testInfo) => {
  const ip = page.locator(".card-info h3.ip");
  await expect(ip).toHaveText(testInfo.data.sorgu);
});

test("ülke bilgisi doğru şekilde p tagi ile eklenmiş mi?", async ({
  page,
}, testInfo) => {
  const ulke = page.locator(".card-info p.ulke");
  await expect(ulke).toHaveText(
    `${testInfo.data.country} (${testInfo.data.countryCode})`,
  );
});

test("enlem ve boylam bilgisi metni ve sırası doğru mu?", async ({
  page,
}, testInfo) => {
  const enlemBoylam = page.locator(".card-info p:nth-of-type(2)");
  await expect(enlemBoylam).toHaveText(
    `Enlem: ${testInfo.data.lat} - Boylam: ${testInfo.data.lon}`,
  );
});

test("şehir bilgisi metni ve sırası doğru mu?", async ({ page }, testInfo) => {
  const sehir = page.locator(".card-info p:nth-of-type(3)");
  await expect(sehir).toHaveText(`Şehir: ${testInfo.data.city}`);
});

test("saat dilimi bilgisi metni ve sırası doğru mu?", async ({
  page,
}, testInfo) => {
  const saatDilimi = page.locator(".card-info p:nth-of-type(4)");
  await expect(saatDilimi).toHaveText(`Saat dilimi: ${testInfo.data.timezone}`);
});

test("para birimi bilgisi metni ve sırası doğru mu?", async ({
  page,
}, testInfo) => {
  const paraBirimi = page.locator(".card-info p:nth-of-type(5)");
  await expect(paraBirimi).toHaveText(`Para birimi: ${testInfo.data.currency}`);
});

test("ISP bilgisi metni ve sırası doğru mu?", async ({ page }, testInfo) => {
  const isp = page.locator(".card-info p:nth-of-type(6)");
  await expect(isp).toHaveText(`ISP: ${testInfo.data.isp}`);
});
