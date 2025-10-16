const STORAGE_KEYS = {
  status: 'onboarding:status',
  progress: 'onboarding:progress',
  data: 'onboarding:data',
} as const

// Check if user has completed onboarding
export const checkOnboardingStatus = async (): Promise<boolean> => {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.status) : null
    const parsed = raw ? JSON.parse(raw) as { isComplete?: boolean } : null
    return Boolean(parsed?.isComplete)
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
};
// Save onboarding progress (intermediate state)
export const saveOnboardingProgress = async (formData: any): Promise<boolean> => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(formData || {}))
    }
    return true
  } catch (error) {
    console.error("Error saving onboarding progress:", error);
    throw error;
  }
};
// Save onboarding data (final submission)
export const saveOnboardingData = async (formData: any): Promise<boolean> => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.data, JSON.stringify(formData || {}))
      localStorage.setItem(STORAGE_KEYS.status, JSON.stringify({ isComplete: true }))
    }
    return true
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    throw error;
  }
};

// Load onboarding data
export const loadOnboardingData = async (): Promise<any | null> => {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.data) : null
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.error("Error loading onboarding data:", error);
    return null;
  }
};

// Load onboarding progress
export const loadOnboardingProgress = async (): Promise<any | null> => {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.progress) : null
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.error("Error loading onboarding progress:", error);
    return null;
  }
};
