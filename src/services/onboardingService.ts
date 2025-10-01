const ONBOARDING_ENDPOINT =
  "https://kfrealexpressserver.vercel.app/api/v1/auth/onboarding";

export interface OnboardingError {
  message: string;
  details?: any;
}

// Check if user has completed onboarding
export const checkOnboardingStatus = async (): Promise<boolean> => {
  const onboardingStatus = localStorage.getItem("onboardingComplete");
  return onboardingStatus === "true";
};

// Save onboarding progress (just localStorage)
export const saveOnboardingProgress = async (
  formData: any
): Promise<{ success: boolean; error?: OnboardingError }> => {
  try {
    localStorage.setItem("onboardingProgress", JSON.stringify(formData));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: {
        message: "Failed to save progress",
        details: error,
      },
    };
  }
};

// Submit onboarding data to your endpoint
export const saveOnboardingData = async (
  formData: any
): Promise<{ success: boolean; error?: OnboardingError }> => {
  try {
    // Clean the form data
    const cleanedData = {};
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === "string") {
        cleanedData[key] = formData[key].trim();
      } else {
        cleanedData[key] = formData[key];
      }
    });

    // Submit to your endpoint
    const response = await fetch(ONBOARDING_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanedData),
    });

    if (response.ok) {
      // Success
      localStorage.setItem("onboardingComplete", "true");
      localStorage.removeItem("onboardingProgress");
      return { success: true };
    } else {
      // Handle error response from your endpoint
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use status text
      }

      return {
        success: false,
        error: {
          message: errorMessage,
          details: { status: response.status, statusText: response.statusText },
        },
      };
    }
  } catch (error) {
    // Network or other errors
    return {
      success: false,
      error: {
        message: (error as Error).message || "Network error occurred",
        details: error,
      },
    };
  }
};
