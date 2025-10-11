import { 
  checkOnboardingStatus as mockCheckStatus,
  saveOnboardingProgress as mockSaveProgress,
  saveOnboardingData as mockSaveData,
  loadOnboardingData as mockLoadData,
  loadOnboardingProgress as mockLoadProgress
} from "./mockOnboardingAPI";

// Check if user has completed onboarding
export const checkOnboardingStatus = async (): Promise<boolean> => {
  try {
    const status = await mockCheckStatus();
    return status.isComplete;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
};
// Save onboarding progress (intermediate state)
export const saveOnboardingProgress = async (formData: any): Promise<boolean> => {
  try {
    const result = await mockSaveProgress(formData);
    return result.success;
  } catch (error) {
    console.error("Error saving onboarding progress:", error);
    throw error;
  }
};
// Save onboarding data (final submission)
export const saveOnboardingData = async (formData: any): Promise<boolean> => {
  try {
    const result = await mockSaveData(formData);
    return result.success;
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    throw error;
  }
};

// Load onboarding data
export const loadOnboardingData = async (): Promise<any | null> => {
  try {
    return await mockLoadData();
  } catch (error) {
    console.error("Error loading onboarding data:", error);
    return null;
  }
};

// Load onboarding progress
export const loadOnboardingProgress = async (): Promise<any | null> => {
  try {
    return await mockLoadProgress();
  } catch (error) {
    console.error("Error loading onboarding progress:", error);
    return null;
  }
};
