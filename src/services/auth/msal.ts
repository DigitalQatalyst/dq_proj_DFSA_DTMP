import {
  PublicClientApplication,
  Configuration,
  BrowserCacheLocation,
  LogLevel,
} from "@azure/msal-browser";

// Support both NEXT_PUBLIC_* and VITE_* envs
const env = (import.meta as any).env as Record<string, string | undefined>;
console.log(env);

const SUB = env.NEXT_PUBLIC_CIAM_SUBDOMAIN;
const CLIENT_ID = env.NEXT_PUBLIC_AAD_CLIENT_ID || env.VITE_AZURE_CLIENT_ID;
const REDIRECT_URI =
  env.NEXT_PUBLIC_REDIRECT_URI ||
  env.VITE_AZURE_REDIRECT_URI ||
  window.location.origin;
const POST_LOGOUT_REDIRECT_URI =
  env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI ||
  env.VITE_AZURE_POST_LOGOUT_REDIRECT_URI ||
  REDIRECT_URI;
const API_SCOPES = (env.NEXT_PUBLIC_API_SCOPES || env.VITE_AZURE_SCOPES || "")
  .split(/[\s,]+/)
  .map((s) => s.trim())
  .filter(Boolean);

const CUSTOM_DOMAIN =
  env.NEXT_PUBLIC_CIAM_CUSTOM_DOMAIN || env.VITE_AZURE_CUSTOM_DOMAIN; // e.g., login.example.com
const TENANT_ID = env.NEXT_PUBLIC_TENANT_ID || env.VITE_AZURE_TENANT_ID; // GUID tenant id for custom domain

let computedAuthority: string;
if (CUSTOM_DOMAIN && TENANT_ID) {
  computedAuthority = `https://${CUSTOM_DOMAIN}/${TENANT_ID}`;
} else if (SUB) {
  computedAuthority = `https://${SUB}.ciamlogin.com/`;
} else {
  computedAuthority =
    env.VITE_AZURE_AUTHORITY || "https://login.microsoftonline.com/common";
}

const knownAuthorities: string[] = (() => {
  if (CUSTOM_DOMAIN) return [CUSTOM_DOMAIN];
  if (SUB) return [`${SUB}.ciamlogin.com`];
  try {
    const url = new URL(computedAuthority);
    return [url.host];
  } catch {
    return [];
  }
})();

export const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID || "YOUR_AZURE_AD_CLIENT_ID",
    authority: computedAuthority,
    knownAuthorities,
    redirectUri: REDIRECT_URI,
    postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Warning,
      loggerCallback: (level, message) => {
        if (level >= LogLevel.Error) console.error(message);
      },
    },
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const defaultLoginRequest = {
  scopes: API_SCOPES.length ? API_SCOPES : [],
};
