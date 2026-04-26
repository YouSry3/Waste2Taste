export interface VendorSignupDraft {
  ownerName: string;
  email: string;
  phoneNumber: string;
  businessName?: string;
  category?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
}

const VENDOR_SIGNUP_DRAFT_KEY = "vendorSignupDraft";

const canUseStorage = () => typeof window !== "undefined";

export const saveVendorSignupDraft = (draft: VendorSignupDraft) => {
  if (!canUseStorage()) {
    return;
  }

  const serializedDraft = JSON.stringify(draft);

  try {
    window.localStorage.setItem(VENDOR_SIGNUP_DRAFT_KEY, serializedDraft);
  } catch {
    try {
      window.sessionStorage.setItem(VENDOR_SIGNUP_DRAFT_KEY, serializedDraft);
    } catch (error) {
      console.error("Failed to persist vendor signup draft.", error);
    }
  }
};

export const getVendorSignupDraft = (): VendorSignupDraft | null => {
  if (!canUseStorage()) {
    return null;
  }

  const raw =
    window.localStorage.getItem(VENDOR_SIGNUP_DRAFT_KEY) ||
    window.sessionStorage.getItem(VENDOR_SIGNUP_DRAFT_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as VendorSignupDraft;
  } catch {
    return null;
  }
};

export const clearVendorSignupDraft = () => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(VENDOR_SIGNUP_DRAFT_KEY);
  window.sessionStorage.removeItem(VENDOR_SIGNUP_DRAFT_KEY);
};
