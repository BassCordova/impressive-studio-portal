import { put, list, del, get } from "@vercel/blob";
import type { OnboardingData } from "./onboarding-types";
import { normalizeOnboarding } from "./onboarding-types";

const PREFIX = "onboarding/";

export async function saveOnboarding(data: OnboardingData) {
  await put(`${PREFIX}${data.id}.json`, JSON.stringify(data, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return data;
}

export async function getOnboarding(id: string): Promise<OnboardingData | null> {
  const result = await get(`${PREFIX}${id}.json`, {
    access: "private",
    useCache: false,
  });
  if (!result || result.statusCode !== 200) return null;
  const text = await new Response(result.stream).text();
  return normalizeOnboarding(JSON.parse(text));
}

export async function listOnboardings(): Promise<OnboardingData[]> {
  const { blobs } = await list({ prefix: PREFIX });
  const records = await Promise.all(
    blobs.map(async (b) => {
      const result = await get(b.pathname, { access: "private", useCache: false });
      if (!result || result.statusCode !== 200) return null;
      const text = await new Response(result.stream).text();
      return normalizeOnboarding(JSON.parse(text));
    })
  );
  return records
    .filter((r): r is OnboardingData => r !== null)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function deleteOnboarding(id: string) {
  await del(`${PREFIX}${id}.json`);
}
