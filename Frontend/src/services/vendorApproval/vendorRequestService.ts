// import { apiClient } from "../api/apiClient";
// import { API_CONFIG } from "../api/apiConfig";
// import { VendorApprovalStatus } from "../auth/authService";

// export interface CreateVendorRequestPayload {
//   ownerName: string;
//   businessName: string;
//   email: string;
//   phoneNumber: string;
//   category: string;
//   address: string;
//   latitude: number;
//   longitude: number;
//   businessLicenseFile: File;
//   healthCertificateFile: File;
// }

// export interface VendorRequestCreationResult {
//   requestId: number | null;
//   data: unknown;
// }

// interface VendorRequestDecisionPayload {
//   reason?: string;
//   notes?: string;
// }

// const VENDOR_REQUEST_STATUS_ENDPOINTS = [
//   "/VendorRequests/status",
//   "/VendorRequests/me",
//   "/VendorRequests",
// ];

// const normalizeStatus = (value: unknown): VendorApprovalStatus | null => {
//   if (typeof value !== "string") {
//     return null;
//   }

//   const normalized = value.trim().toLowerCase();
//   if (
//     normalized === "pending" ||
//     normalized === "approved" ||
//     normalized === "rejected"
//   ) {
//     return normalized;
//   }

//   return null;
// };

// const tryReadStatus = (payload: any): VendorApprovalStatus | null => {
//   if (!payload) {
//     return null;
//   }

//   const directStatus = normalizeStatus(
//     payload.status ??
//       payload.vendorApprovalStatus ??
//       payload.vendorRequestStatus ??
//       payload.requestStatus,
//   );
//   if (directStatus) {
//     return directStatus;
//   }

//   const dataStatus = normalizeStatus(
//     payload.data?.status ??
//       payload.data?.vendorApprovalStatus ??
//       payload.data?.vendorRequestStatus ??
//       payload.data?.requestStatus,
//   );
//   if (dataStatus) {
//     return dataStatus;
//   }

//   const approvedFlag =
//     payload.isApproved ??
//     payload.approved ??
//     payload.data?.isApproved ??
//     payload.data?.approved;

//   if (typeof approvedFlag === "boolean") {
//     return approvedFlag ? "approved" : "pending";
//   }

//   return null;
// };

// const getErrorStatusCode = (error: any): number | undefined =>
//   error?.statusCode ?? error?.response?.status;

// const buildVendorRequestCandidates = (paths: string[]): string[] => {
//   const rootBase = (API_CONFIG?.BASE_URL || "").replace(/\/api\/?$/i, "");

//   return Array.from(
//     new Set(
//       paths.flatMap((path) => {
//         const normalized = path.startsWith("/") ? path : `/${path}`;
//         const candidates = [];

//         if (rootBase) {
//           candidates.push(`${rootBase}${normalized}`);
//         }

//         candidates.push(normalized);

//         return candidates;
//       }),
//     ),
//   );
// };

// const postVendorRequestWithFallbacks = async <TResponse>(
//   paths: string[],
//   body: unknown,
// ): Promise<TResponse> => {
//   let lastError: unknown;

//   for (const endpoint of buildVendorRequestCandidates(paths)) {
//     try {
//       // Let Axios/browser set the multipart boundary automatically.
//       const response = await apiClient.post<TResponse>(endpoint, body);
//       return response.data;
//     } catch (error: any) {
//       lastError = error;
//       if (getErrorStatusCode(error) !== 404) {
//         throw error;
//       }
//     }
//   }

//   throw lastError;
// };

// const getVendorRequestCreateEndpoint = (): string => {
//   const rootBase = (API_CONFIG?.BASE_URL || "").replace(/\/api\/?$/i, "");
//   return rootBase ? `${rootBase}/VendorRequests` : "/VendorRequests";
// };

// const normalizeId = (value: unknown): number | null => {
//   if (typeof value === "number" && Number.isFinite(value)) {
//     return value;
//   }

//   if (typeof value === "string" && value.trim() !== "") {
//     const parsed = Number(value);
//     if (Number.isFinite(parsed)) {
//       return parsed;
//     }
//   }

//   return null;
// };

// export const extractVendorRequestId = (payload: any): number | null => {
//   const source = payload?.data ?? payload;

//   const directId = normalizeId(
//     source?.id ?? source?.requestId ?? source?.vendorRequestId,
//   );
//   if (directId != null) {
//     return directId;
//   }

//   const nestedId = normalizeId(
//     source?.data?.id ?? source?.data?.requestId ?? source?.data?.vendorRequestId,
//   );
//   if (nestedId != null) {
//     return nestedId;
//   }

//   return null;
// };

// export const createVendorRequest = async (
//   payload: CreateVendorRequestPayload,
// ): Promise<VendorRequestCreationResult> => {
//   const formData = new FormData();
//   // Match the backend DTO field names exactly for reliable form binding.
//   formData.append("Name", payload.businessName);
//   formData.append("Category", payload.category);
//   formData.append("Email", payload.email);
//   formData.append("PhoneNumber", payload.phoneNumber);
//   formData.append("Address", payload.address);
//   formData.append("Latitude", String(payload.latitude));
//   formData.append("Longitude", String(payload.longitude));
//   formData.append("HealthCertificateFile", payload.healthCertificateFile);
//   formData.append("BusinessLicenseFile", payload.businessLicenseFile);

//   const response = await apiClient.post<unknown>(
//     getVendorRequestCreateEndpoint(),
//     formData,
//   );

//   return {
//     requestId: extractVendorRequestId(response.data),
//     data: response.data,
//   };
// };

// export const getVendorRequestStatus = async (): Promise<VendorApprovalStatus | null> => {
//   for (const endpoint of buildVendorRequestCandidates(VENDOR_REQUEST_STATUS_ENDPOINTS)) {
//     try {
//       const response = await apiClient.get(endpoint);
//       const status = tryReadStatus(response.data);
//       if (status) {
//         return status;
//       }
//     } catch (error: any) {
//       const statusCode = getErrorStatusCode(error);
//       if (statusCode === 404) {
//         continue;
//       }
//       throw error;
//     }
//   }

//   return null;
// };

// export const getPendingVendorRequestsForAdmin = async (): Promise<any[]> => {
//   const endpoints = [
//     "/VendorRequests/pending/all",
//   ];

//   for (const endpoint of buildVendorRequestCandidates(endpoints)) {
//     try {
//       const response = await apiClient.get(endpoint);
//       const payload = response.data;

//       if (Array.isArray(payload)) {
//         return payload;
//       }

//       if (Array.isArray(payload?.data)) {
//         return payload.data;
//       }

//       return [];
//     } catch (error: any) {
//       const statusCode = getErrorStatusCode(error);
//       if (statusCode === 404) {
//         continue;
//       }

//       throw error;
//     }
//   }

//   return [];
// };

// export const approveVendorRequest = async (requestId: number) => {
//   return performVendorDecisionRequest("approve", requestId);
// };

// export const rejectVendorRequest = async (
//   requestId: number,
//   payload?: VendorRequestDecisionPayload,
// ) => {
//   const endpoints = ["/VendorRequests/reject"];
//   const bodyCandidates = [
//     { id: requestId, ...payload },
//     { requestId, ...payload },
//     { vendorId: requestId, ...payload },
//     { vendorRequestId: requestId, ...payload },
//     { Id: requestId, ...payload },
//     requestId,
//   ];

//   let lastError: unknown;

//   for (const endpoint of buildVendorRequestCandidates(endpoints)) {
//     for (const body of bodyCandidates) {
//       try {
//         const response = await apiClient.put(endpoint, body);
//         return response.data;
//       } catch (error: any) {
//         lastError = error;
//         const statusCode = getErrorStatusCode(error);
//         if (statusCode === 404) {
//           break;
//         }
//       }
//     }

//     try {
//       const response = await apiClient.put(endpoint, payload, {
//         params: {
//           id: requestId,
//           requestId,
//           vendorId: requestId,
//         },
//       });
//       return response.data;
//     } catch (error: any) {
//       lastError = error;
//       const statusCode = getErrorStatusCode(error);
//       if (statusCode === 404) {
//         continue;
//       }
//     }
//   }

//   throw lastError;
// };

// const performVendorDecisionRequest = async (
//   decision: "approve" | "reject",
//   requestId: number,
//   payload?: VendorRequestDecisionPayload,
// ) => {
//   const endpoints = [
//     `/VendorRequests/${decision}`,
//     `/vendorRequests/${decision}`,
//     `/VendorRequests/${requestId}/${decision}`,
//     `/vendorRequests/${requestId}/${decision}`,
//   ];

//   const bodyCandidates = [
//     { id: requestId, ...payload },
//     { requestId, ...payload },
//     { vendorId: requestId, ...payload },
//     { vendorRequestId: requestId, ...payload },
//     { Id: requestId, ...payload },
//     requestId,
//   ];

//   const methods = ["put", "post", "patch"] as const;
//   let lastError: unknown;

//   for (const endpoint of buildVendorRequestCandidates(endpoints)) {
//     for (const method of methods) {
//       for (const body of bodyCandidates) {
//         try {
//           const response =
//             method === "put"
//               ? await apiClient.put(endpoint, body)
//               : method === "post"
//                 ? await apiClient.post(endpoint, body)
//                 : await apiClient.patch(endpoint, body);
//           return response.data;
//         } catch (error: any) {
//           lastError = error;
//           const statusCode = getErrorStatusCode(error);
//           if (statusCode === 404) {
//             break;
//           }
//         }
//       }

//       try {
//         const response = await apiClient.request({
//           url: endpoint,
//           method,
//           params: {
//             id: requestId,
//             requestId,
//             vendorId: requestId,
//           },
//           data: payload,
//         });
//         return response.data;
//       } catch (error: any) {
//         lastError = error;
//         const statusCode = getErrorStatusCode(error);
//         if (statusCode === 404) {
//           break;
//         }
//       }
//     }
//   }

//   throw lastError;
// };
import { apiClient } from "../api/apiClient";
import { API_CONFIG } from "../api/apiConfig";
import { VendorApprovalStatus } from "../auth/authService";
// D:\Graduation Project\GraduationProject\Frontend\src\services\auth\authService.ts

export interface CreateVendorRequestPayload {
  ownerName: string;
  businessName: string;
  email: string;
  phoneNumber: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  businessLicenseFile: File;
  healthCertificateFile: File;
}

export interface VendorRequestCreationResult {
  requestId: number | null;
  data: unknown;
}

interface VendorRequestDecisionPayload {
  reason?: string;
  notes?: string;
}

// ─── Status fetch endpoints ───────────────────────────────────────────────────

const VENDOR_REQUEST_STATUS_ENDPOINTS = [
  "/VendorRequests/status",
  "/VendorRequests/me",
  "/VendorRequests",
];

const normalizeStatus = (value: unknown): VendorApprovalStatus | null => {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "pending") return "pending";
  if (normalized === "approved" || normalized === "active") return "approved"; // ← ADD "active"
  if (normalized === "rejected") return "rejected";
  return null;
};

const tryReadStatus = (payload: any): VendorApprovalStatus | null => {
  if (!payload) return null;

  const directStatus = normalizeStatus(
    payload.status ??
      payload.vendorApprovalStatus ??
      payload.vendorRequestStatus ??
      payload.requestStatus,
  );
  if (directStatus) return directStatus;

  const dataStatus = normalizeStatus(
    payload.data?.status ??
      payload.data?.vendorApprovalStatus ??
      payload.data?.vendorRequestStatus ??
      payload.data?.requestStatus,
  );
  if (dataStatus) return dataStatus;

  const approvedFlag =
    payload.isApproved ??
    payload.approved ??
    payload.data?.isApproved ??
    payload.data?.approved;

  if (typeof approvedFlag === "boolean") {
    return approvedFlag ? "approved" : "pending";
  }

  return null;
};

const getErrorStatusCode = (error: any): number | undefined =>
  error?.statusCode ?? error?.response?.status;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const normalizeId = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

export const extractVendorRequestId = (payload: any): number | null => {
  const source = payload?.data ?? payload;
  const directId = normalizeId(
    source?.id ?? source?.requestId ?? source?.vendorRequestId,
  );
  if (directId != null) return directId;

  const nestedId = normalizeId(
    source?.data?.id ??
      source?.data?.requestId ??
      source?.data?.vendorRequestId,
  );
  if (nestedId != null) return nestedId;

  return null;
};

// ─── Create vendor request ────────────────────────────────────────────────────
export const createVendorRequest = async (
  payload: CreateVendorRequestPayload,
): Promise<VendorRequestCreationResult> => {
  const formData = new FormData();
  formData.append("Name", payload.businessName);
  formData.append("Category", payload.category);
  formData.append("Email", payload.email);
  formData.append("PhoneNumber", payload.phoneNumber);
  formData.append("Address", payload.address);
  formData.append("Latitude", String(payload.latitude));
  formData.append("Longitude", String(payload.longitude));
  formData.append("HealthCertificateFile", payload.healthCertificateFile);
  formData.append("BusinessLicenseFile", payload.businessLicenseFile);

  const response = await apiClient.post<unknown>("/VendorRequests", formData);
  const requestId = extractVendorRequestId(response.data);

  // ← Save so getVendorRequestStatus can use it later
  if (requestId) {
    localStorage.setItem("vendorRequestId", String(requestId));
  }

  return { requestId, data: response.data };
};
// export const createVendorRequest = async (
//   payload: CreateVendorRequestPayload,
// ): Promise<VendorRequestCreationResult> => {
//   const formData = new FormData();
//   formData.append("Name", payload.businessName);
//   formData.append("Category", payload.category);
//   formData.append("Email", payload.email);
//   formData.append("PhoneNumber", payload.phoneNumber);
//   formData.append("Address", payload.address);
//   formData.append("Latitude", String(payload.latitude));
//   formData.append("Longitude", String(payload.longitude));
//   formData.append("HealthCertificateFile", payload.healthCertificateFile);
//   formData.append("BusinessLicenseFile", payload.businessLicenseFile);

//   const response = await apiClient.post<unknown>("/VendorRequests", formData);

//   return {
//     requestId: extractVendorRequestId(response.data),
//     data: response.data,
//   };
// };

// ─── Get vendor request status ────────────────────────────────────────────────

// export const getVendorRequestStatus = async (): Promise<VendorApprovalStatus | null> => {
//   try {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     const email = user?.email?.toLowerCase();
//     if (!email) return null;

//     // Check pending requests first — pending vendors aren't in /vendors yet
//     const pendingRes = await apiClient.get("/VendorRequests/pending/all");
//     const pendingList: any[] =
//       Array.isArray(pendingRes.data) ? pendingRes.data :
//       Array.isArray(pendingRes.data?.data) ? pendingRes.data.data :
//       Array.isArray(pendingRes.data?.value) ? pendingRes.data.value : [];

//     const pendingMatch = pendingList.find(
//       (v: any) => (v.email ?? "").toLowerCase() === email
//     );

//     if (pendingMatch) {
//       console.log("🔍 Found in pending requests:", pendingMatch);
//       return normalizeStatus(pendingMatch.status) ?? "pending";
//     }

//     // Check all vendor requests by stored requestId
//     const storedRequestId = localStorage.getItem("vendorRequestId");
//     if (storedRequestId) {
//       const res = await apiClient.get(`/VendorRequests/${storedRequestId}`);
//       const payload = res.data?.value ?? res.data?.data ?? res.data;
//       const status = normalizeStatus(
//         payload?.status ?? payload?.approvalStatus ?? payload?.requestStatus
//       );
//       if (status) return status;
//     }

//     // Check all requests and match by email
//     const allRes = await apiClient.get("/VendorRequests/all");
//     const allList: any[] =
//       Array.isArray(allRes.data) ? allRes.data :
//       Array.isArray(allRes.data?.data) ? allRes.data.data :
//       Array.isArray(allRes.data?.value) ? allRes.data.value : [];

//     const myRequest = allList.find(
//       (v: any) => (v.email ?? "").toLowerCase() === email
//     );

//     if (myRequest) {
//       console.log("🔍 Found in all requests:", myRequest);
//       return normalizeStatus(myRequest.status) ?? "pending";
//     }

//     // Only check /vendors if nothing found above — means they're approved
//     const vendorsRes = await apiClient.get("/vendors");
//     const vendorsList: any[] =
//       Array.isArray(vendorsRes.data) ? vendorsRes.data :
//       Array.isArray(vendorsRes.data?.data) ? vendorsRes.data.data :
//       Array.isArray(vendorsRes.data?.value) ? vendorsRes.data.value : [];

//     const approvedVendor = vendorsList.find(
//       (v: any) => (v.email ?? "").toLowerCase() === email
//     );

//     if (approvedVendor) {
//       console.log("🔍 Found in approved vendors:", approvedVendor);
//       return "approved";
//     }

//     return null;
//   } catch (error: any) {
//     console.warn("getVendorRequestStatus failed:", error?.message);
//     return null;
//   }
// };

export const getVendorRequestStatus = async (): Promise<VendorApprovalStatus | null> => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const email = user?.email?.toLowerCase();
    if (!email) return null;

    // Check vendorApprovalRequests saved locally after form submission
    const stored = localStorage.getItem("vendorApprovalRequests");
    if (stored) {
      const requests = JSON.parse(stored) as Array<{ email?: string; status?: string }>;
      const match = requests.find(
        (r) => (r.email ?? "").trim().toLowerCase() === email
      );
      if (match?.status === "pending") return "pending";
      if (match?.status === "rejected") return "rejected";
      if (match?.status === "approved") return "approved";
    }

    // Check /vendors to see if they're approved on the backend
    const vendorsRes = await apiClient.get("/vendors");
    const vendorsList: any[] =
      Array.isArray(vendorsRes.data) ? vendorsRes.data :
      Array.isArray(vendorsRes.data?.data) ? vendorsRes.data.data :
      Array.isArray(vendorsRes.data?.value) ? vendorsRes.data.value : [];

    const approvedVendor = vendorsList.find(
      (v: any) => (v.email ?? "").toLowerCase() === email
    );

    if (approvedVendor) return "approved";

    return null;
  } catch (error: any) {
    console.warn("getVendorRequestStatus failed:", error?.message);
    return null;
  }
};
// ─── Get pending vendor requests for admin ────────────────────────────────────

export const getPendingVendorRequestsForAdmin = async (): Promise<any[]> => {
  const endpoints = [
    "/VendorRequests/pending/all",
    "/VendorRequests/pending",
    "/VendorRequests",
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await apiClient.get(endpoint);
      const payload = response.data;
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.data)) return payload.data;
      return [];
    } catch (error: any) {
      const statusCode = getErrorStatusCode(error);
      if (statusCode === 404) continue;
      throw error;
    }
  }

  return [];
};

// ─── Approve / Reject vendor request ─────────────────────────────────────────
//
// Your backend follows the same flat-action pattern as /Listing/approve:
//   POST /VendorRequests/approve   with the ID somewhere in the body
//   POST /VendorRequests/reject    with the ID + reason in the body
//
// The original error log showed 405 on POST /vendorRequests/approve, meaning
// the route EXISTS — we just had the wrong body shape. We try the most likely
// body field names (id, requestId, vendorId) and stop on first success.
//
// Logic per attempt:
//   404  → route not found, try the next URL
//   400  → route found but body rejected, try next body shape
//   any other error → real problem (auth, server error), surface immediately

// const tryPost = async (url: string, body: object): Promise<any> => {
//   const response = await apiClient.post(url, body);
//   return response.data;
// };

const tryPut = async (url: string, body: object): Promise<any> => {
  const response = await apiClient.put(url, body);
  return response.data;
};
// export const approveVendorRequest = async (requestId: number): Promise<any> => {
//   const bodyShapes = [
//     { id: requestId },
//     { requestId },
//     { vendorId: requestId },
//     { vendorRequestId: requestId },
//     { Id: requestId },
//     { RequestId: requestId },
//     { VendorId: requestId },
//   ];

//   const endpoints = [
//     "/VendorRequests/approve",
//     "/vendorRequests/approve",
//     `/VendorRequests/${requestId}/approve`,
//     `/vendorRequests/${requestId}/approve`,
//   ];

//   let lastError: unknown;

//   for (const endpoint of endpoints) {
//     for (const body of bodyShapes) {
//       try {
//         // return await tryPost(endpoint, body);
//         return await tryPut(endpoint, body);
//       } catch (error: any) {
//         lastError = error;
//         const statusCode = getErrorStatusCode(error);
//         // Route not found → skip to next endpoint
//         if (statusCode === 404) break;
//         // Route found but body rejected → try next body shape
//         if (statusCode === 400) continue;
//         // Real error (401, 500, etc.) → surface immediately
//         throw error;
//       }
//     }
//   }

//   throw lastError;
// };
export const approveVendorRequest = async (
  requestId: string | number,
): Promise<any> => {
  const response = await apiClient.put(
    "/VendorRequests/approve",
    {},
    {
      headers: {
        vendorRequestId: String(requestId),
      },
    }
  );

  return response.data;
};
// export const rejectVendorRequest = async (
//   requestId: number,
//   payload?: VendorRequestDecisionPayload,
// ): Promise<any> => {
//   const reason = payload?.reason ?? payload?.notes ?? "Rejected";

//   const bodyShapes = [
//     { id: requestId, reason },
//     { requestId, reason },
//     { vendorId: requestId, reason },
//     { vendorRequestId: requestId, reason },
//     { Id: requestId, Reason: reason },
//     { RequestId: requestId, Reason: reason },
//     { VendorId: requestId, Reason: reason },
//     { id: requestId, notes: reason },
//     { requestId, notes: reason },
//   ];

//   const endpoints = [
//     "/VendorRequests/reject",
//     "/vendorRequests/reject",
//     `/VendorRequests/${requestId}/reject`,
//     `/vendorRequests/${requestId}/reject`,
//   ];

//   let lastError: unknown;

//   for (const endpoint of endpoints) {
//     for (const body of bodyShapes) {
//       try {
//         return await tryPost(endpoint, body);
//       } catch (error: any) {
//         lastError = error;
//         const statusCode = getErrorStatusCode(error);
//         if (statusCode === 404) break;
//         if (statusCode === 400) continue;
//         throw error;
//       }
//     }
//   }

//   throw lastError;
// };


export const rejectVendorRequest = async (
  requestId: string | number,
): Promise<any> => {
  const response = await apiClient.put(
    "/VendorRequests/reject",
    {},
    {
      headers: {
        vendorRequestId: String(requestId),
      },
    }
  );

  return response.data;
};
