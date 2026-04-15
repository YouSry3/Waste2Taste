import { apiClient } from "../api/apiClient";
import { VendorApprovalStatus } from "../auth/authService";

export interface CreateVendorRequestPayload {
  ownerName: string;
  businessName: string;
  email: string;
  phoneNumber: string;
  category: string;
  address: string;
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

const VENDOR_REQUEST_STATUS_ENDPOINTS = [
  "/vendorRequests/status",
  "/VendorRequests/status",
  "/vendorRequests/me",
  "/VendorRequests/me",
  "/vendorRequests",
  "/VendorRequests",
];

const normalizeStatus = (value: unknown): VendorApprovalStatus | null => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (
    normalized === "pending" ||
    normalized === "approved" ||
    normalized === "rejected"
  ) {
    return normalized;
  }

  return null;
};

const tryReadStatus = (payload: any): VendorApprovalStatus | null => {
  if (!payload) {
    return null;
  }

  const directStatus = normalizeStatus(
    payload.status ??
      payload.vendorApprovalStatus ??
      payload.vendorRequestStatus ??
      payload.requestStatus,
  );
  if (directStatus) {
    return directStatus;
  }

  const dataStatus = normalizeStatus(
    payload.data?.status ??
      payload.data?.vendorApprovalStatus ??
      payload.data?.vendorRequestStatus ??
      payload.data?.requestStatus,
  );
  if (dataStatus) {
    return dataStatus;
  }

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

const normalizeId = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
};

export const extractVendorRequestId = (payload: any): number | null => {
  const directId = normalizeId(
    payload?.id ?? payload?.requestId ?? payload?.vendorRequestId,
  );
  if (directId != null) {
    return directId;
  }

  const nestedId = normalizeId(
    payload?.data?.id ??
      payload?.data?.requestId ??
      payload?.data?.vendorRequestId,
  );
  if (nestedId != null) {
    return nestedId;
  }

  return null;
};

export const createVendorRequest = async (
  payload: CreateVendorRequestPayload,
): Promise<VendorRequestCreationResult> => {
  const formData = new FormData();
  formData.append("OwnerName", payload.ownerName);
  formData.append("Name", payload.businessName);
  formData.append("Category", payload.category);
  formData.append("Email", payload.email);
  formData.append("PhoneNumber", payload.phoneNumber);
  formData.append("Address", payload.address);
  formData.append("BusinessLicenseFile", payload.businessLicenseFile);
  formData.append("HealthCertificateFile", payload.healthCertificateFile);

  const response = await apiClient.post("/vendorRequests", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return {
    requestId: extractVendorRequestId(response.data),
    data: response.data,
  };
};

export const getVendorRequestStatus = async (): Promise<VendorApprovalStatus | null> => {
  for (const endpoint of VENDOR_REQUEST_STATUS_ENDPOINTS) {
    try {
      const response = await apiClient.get(endpoint);
      const status = tryReadStatus(response.data);
      if (status) {
        return status;
      }
    } catch (error: any) {
      const statusCode = getErrorStatusCode(error);
      if (statusCode === 404) {
        continue;
      }
      throw error;
    }
  }

  return null;
};

export const getPendingVendorRequestsForAdmin = async (): Promise<any[]> => {
  const endpoints = [
    "/VendorRequests/pending/all",
    "/vendorRequests/pending/all",
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await apiClient.get(endpoint);
      const payload = response.data;

      if (Array.isArray(payload)) {
        return payload;
      }

      if (Array.isArray(payload?.data)) {
        return payload.data;
      }

      return [];
    } catch (error: any) {
      const statusCode = getErrorStatusCode(error);
      if (statusCode === 404) {
        continue;
      }

      throw error;
    }
  }

  return [];
};

export const approveVendorRequest = async (requestId: number) => {
  return performVendorDecisionRequest("approve", requestId);
};

export const rejectVendorRequest = async (
  requestId: number,
  payload?: VendorRequestDecisionPayload,
) => {
  const endpoints = ["/VendorRequests/reject", "/vendorRequests/reject"];
  const bodyCandidates = [
    { id: requestId, ...payload },
    { requestId, ...payload },
    { vendorId: requestId, ...payload },
    { vendorRequestId: requestId, ...payload },
    { Id: requestId, ...payload },
    requestId,
  ];

  let lastError: unknown;

  for (const endpoint of endpoints) {
    for (const body of bodyCandidates) {
      try {
        const response = await apiClient.put(endpoint, body);
        return response.data;
      } catch (error: any) {
        lastError = error;
        const statusCode = getErrorStatusCode(error);
        if (statusCode === 404) {
          break;
        }
      }
    }

    try {
      const response = await apiClient.put(endpoint, payload, {
        params: {
          id: requestId,
          requestId,
          vendorId: requestId,
        },
      });
      return response.data;
    } catch (error: any) {
      lastError = error;
      const statusCode = getErrorStatusCode(error);
      if (statusCode === 404) {
        continue;
      }
    }
  }

  throw lastError;
};

const performVendorDecisionRequest = async (
  decision: "approve" | "reject",
  requestId: number,
  payload?: VendorRequestDecisionPayload,
) => {
  const endpoints = [
    `/VendorRequests/${decision}`,
    `/vendorRequests/${decision}`,
    `/VendorRequests/${requestId}/${decision}`,
    `/vendorRequests/${requestId}/${decision}`,
  ];

  const bodyCandidates = [
    { id: requestId, ...payload },
    { requestId, ...payload },
    { vendorId: requestId, ...payload },
    { vendorRequestId: requestId, ...payload },
    { Id: requestId, ...payload },
    requestId,
  ];

  const methods = ["put", "post", "patch"] as const;
  let lastError: unknown;

  for (const endpoint of endpoints) {
    for (const method of methods) {
      for (const body of bodyCandidates) {
        try {
          const response =
            method === "put"
              ? await apiClient.put(endpoint, body)
              : method === "post"
                ? await apiClient.post(endpoint, body)
                : await apiClient.patch(endpoint, body);
          return response.data;
        } catch (error: any) {
          lastError = error;
          const statusCode = getErrorStatusCode(error);
          if (statusCode === 404) {
            break;
          }
        }
      }

      try {
        const response = await apiClient.request({
          url: endpoint,
          method,
          params: {
            id: requestId,
            requestId,
            vendorId: requestId,
          },
          data: payload,
        });
        return response.data;
      } catch (error: any) {
        lastError = error;
        const statusCode = getErrorStatusCode(error);
        if (statusCode === 404) {
          break;
        }
      }
    }
  }

  throw lastError;
};
