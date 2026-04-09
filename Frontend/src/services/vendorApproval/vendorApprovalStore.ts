import {
  VendorApprovalRequest,
  VendorApprovalStatus,
  VendorDocument,
} from "../../types/vendorApproval";

const VENDOR_REQUESTS_KEY = "vendorApprovalRequests";
const PENDING_VENDOR_EMAIL_KEY = "pendingVendorApprovalEmail";
export const VENDOR_APPROVAL_STORE_EVENT = "vendor-approval-store-updated";

function isBrowser() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch (error) {
    console.error(`Failed to read localStorage key "${key}"`, error);
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function emitStoreUpdate() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(VENDOR_APPROVAL_STORE_EVENT));
}

export function getStoredVendorRequests(): VendorApprovalRequest[] {
  return readJson<VendorApprovalRequest[]>(VENDOR_REQUESTS_KEY, []);
}

function saveStoredVendorRequests(requests: VendorApprovalRequest[]) {
  writeJson(VENDOR_REQUESTS_KEY, requests);
  emitStoreUpdate();
}

export function getVendorRequestByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return getStoredVendorRequests().find(
    (request) => request.email.trim().toLowerCase() === normalizedEmail,
  );
}

export function setPendingVendorApprovalEmail(email: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(PENDING_VENDOR_EMAIL_KEY, email);
  emitStoreUpdate();
}

export function getPendingVendorApprovalEmail() {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(PENDING_VENDOR_EMAIL_KEY);
}

export function clearPendingVendorApprovalEmail() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(PENDING_VENDOR_EMAIL_KEY);
  emitStoreUpdate();
}

export function submitVendorApprovalRequest(
  payload: Omit<VendorApprovalRequest, "id" | "submitted" | "status">,
) {
  const requests = getStoredVendorRequests();
  const existingIndex = requests.findIndex(
    (request) =>
      request.email.trim().toLowerCase() === payload.email.trim().toLowerCase(),
  );

  const request: VendorApprovalRequest = {
    id:
      existingIndex >= 0
        ? requests[existingIndex].id
        : Date.now() + Math.floor(Math.random() * 1000),
    businessName: payload.businessName,
    ownerName: payload.ownerName,
    email: payload.email,
    phone: payload.phone,
    address: payload.address,
    category: payload.category,
    documents: payload.documents,
    submitted: new Date().toISOString(),
    status: "pending",
  };

  if (existingIndex >= 0) {
    requests[existingIndex] = request;
  } else {
    requests.unshift(request);
  }

  saveStoredVendorRequests(requests);
  setPendingVendorApprovalEmail(request.email);

  return request;
}

export function updateVendorApprovalStatus(
  id: number,
  status: VendorApprovalStatus,
  notes?: string,
) {
  const requests = getStoredVendorRequests();
  const updatedRequests = requests.map((request) =>
    request.id === id
      ? {
          ...request,
          status,
          notes,
        }
      : request,
  );

  saveStoredVendorRequests(updatedRequests);

  return updatedRequests.find((request) => request.id === id) ?? null;
}

export function getVendorApprovalStatus(email: string) {
  return getVendorRequestByEmail(email)?.status ?? null;
}

export function subscribeToVendorApprovalStore(callback: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  const handleCustomUpdate = () => callback();
  const handleStorage = (event: StorageEvent) => {
    if (
      event.key === VENDOR_REQUESTS_KEY ||
      event.key === PENDING_VENDOR_EMAIL_KEY
    ) {
      callback();
    }
  };

  window.addEventListener(VENDOR_APPROVAL_STORE_EVENT, handleCustomUpdate);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(
      VENDOR_APPROVAL_STORE_EVENT,
      handleCustomUpdate,
    );
    window.removeEventListener("storage", handleStorage);
  };
}

export function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read file."));
    };

    reader.onerror = () => reject(reader.error ?? new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

export function createVendorDocument(
  file: File,
  url: string,
  overrides: Pick<VendorDocument, "kind" | "label">,
): VendorDocument {
  return {
    id: `${file.name}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    kind: overrides.kind,
    label: overrides.label,
    name: file.name,
    type: file.type || "application/octet-stream",
    size: file.size,
    url,
    uploadedAt: new Date().toISOString(),
  };
}
