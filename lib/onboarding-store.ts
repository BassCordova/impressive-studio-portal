import { createBlobStore } from "./blob-store";
import type { OnboardingData } from "./onboarding-types";
import { normalizeOnboarding } from "./onboarding-types";

const store = createBlobStore<OnboardingData>("onboarding/", normalizeOnboarding);

export const saveOnboarding = (data: OnboardingData) => store.save(data);
export const getOnboarding = (id: string) => store.get(id);
export const listOnboardings = () => store.list();
export const deleteOnboarding = (id: string) => store.delete(id);
