import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../../services/auth/authService";
import { Button } from "../ui/button";
import {
  clearPendingVendorApprovalEmail,
  getPendingVendorApprovalEmail,
  getVendorRequestByEmail,
  setPendingVendorApprovalEmail,
  subscribeToVendorApprovalStore,
} from "../../services/vendorApproval/vendorApprovalStore";
import { getVendorRequestStatus } from "../../services/vendorApproval/vendorRequestService";

type ApprovalViewState = "missing" | "pending" | "approved" | "rejected";

export default function PendingApprovalPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isChecking, setIsChecking] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [viewState, setViewState] = useState<ApprovalViewState>("pending");
  const [details, setDetails] = useState<string>("");
  const [trackedEmail, setTrackedEmail] = useState("");

  useEffect(() => {
    const queryEmail = searchParams.get("email")?.trim() || "";
    const storedEmail = getPendingVendorApprovalEmail()?.trim() || "";
    const currentUserEmail = authService.getCurrentUser()?.email || "";
    const resolvedEmail = queryEmail || storedEmail || currentUserEmail;

    if (resolvedEmail) {
      setPendingVendorApprovalEmail(resolvedEmail);
      setTrackedEmail(resolvedEmail);
    }
  }, [searchParams]);

  const syncApprovalState = useCallback(async () => {
    setIsChecking(true);
    try {
      const backendStatus = await getVendorRequestStatus();
      if (backendStatus) {
        authService.setVendorRequestState({
          vendorRequestCompleted: true,
          vendorApprovalStatus: backendStatus,
        });

        if (backendStatus === "approved") {
          setViewState("approved");
          setDetails("Your vendor account is approved.");
          return;
        }

        if (backendStatus === "rejected") {
          setViewState("rejected");
          setDetails(
            "Your vendor request was rejected. Please contact support.",
          );
          return;
        }

        setViewState("pending");
        setDetails("Request pending. Please wait for an admin to approve.");
        return;
      }
    } catch {
      // Fall back to local shared store + current user flags.
    } finally {
      setIsChecking(false);
    }

    if (trackedEmail) {
      const localRequest = getVendorRequestByEmail(trackedEmail);
      if (localRequest?.status === "approved") {
        authService.setVendorRequestState({
          vendorRequestCompleted: true,
          vendorApprovalStatus: "approved",
        });
        setViewState("approved");
        setDetails("Your vendor account is approved.");
        return;
      }
      if (localRequest?.status === "rejected") {
        authService.setVendorRequestState({
          vendorRequestCompleted: true,
          vendorApprovalStatus: "rejected",
        });
        setViewState("rejected");
        setDetails(
          localRequest.notes ||
            "Your vendor request was rejected. Please contact support.",
        );
        return;
      }
      if (localRequest?.status === "pending") {
        setViewState("pending");
        setDetails("Request pending. Please wait for an admin to approve.");
        return;
      }
    }

    const vendorAccessState = authService.getVendorAccessState();
    if (vendorAccessState === "approved") {
      setViewState("approved");
      setDetails("Your vendor account is approved.");
      return;
    }

    if (vendorAccessState === "rejected") {
      setViewState("rejected");
      setDetails("Your vendor request was rejected. Please contact support.");
      return;
    }

    if (vendorAccessState === "needs_request") {
      setViewState("missing");
      setDetails("Complete your vendor request before dashboard access.");
      return;
    }

    setViewState("pending");
    setDetails("Request pending. Please wait for an admin to approve.");
  }, [trackedEmail]);

  useEffect(() => {
    syncApprovalState();

    const unsubscribe = subscribeToVendorApprovalStore(syncApprovalState);
    const intervalId = setInterval(syncApprovalState, 7000);

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, [syncApprovalState]);

  useEffect(() => {
    if (viewState !== "approved") {
      return;
    }

    clearPendingVendorApprovalEmail();
    const redirectTimer = setTimeout(() => {
      navigate("/panel/vendor/dashboard", { replace: true });
    }, 1400);

    return () => clearTimeout(redirectTimer);
  }, [navigate, viewState]);

  const statusLabel = useMemo(() => {
    if (viewState === "approved") return "Approved";
    if (viewState === "rejected") return "Rejected";
    if (viewState === "missing") return "Action Needed";
    return "Pending Approval";
  }, [viewState]);

  const statusClass = useMemo(() => {
    if (viewState === "approved") return "bg-green-50 text-green-700 border-green-200";
    if (viewState === "rejected") return "bg-red-50 text-red-700 border-red-200";
    if (viewState === "missing") return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  }, [viewState]);

  const handleBack = async () => {
    setIsLeaving(true);
    authService.clearLocalAuth();
    await new Promise((resolve) => setTimeout(resolve, 250));
    navigate("/?panel=vendor", { replace: true });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-3xl border border-white/60 bg-white/85 p-8 text-center shadow-2xl shadow-violet-100/50 backdrop-blur">
        <div
          className={`mb-6 inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${statusClass}`}
        >
          {statusLabel}
        </div>

        <h1 className="mb-3 text-2xl font-bold text-slate-900">
          Vendor Approval Status
        </h1>
        <p className="mb-3 text-sm text-slate-600">
          {details ||
            "Your request is being reviewed. We will update this page automatically."}
        </p>
        {trackedEmail && (
          <p className="mb-6 text-xs font-medium text-violet-500">
            {trackedEmail}
          </p>
        )}

        {viewState === "missing" && (
          <Button
            className="mb-3 w-full bg-green-600 text-white hover:bg-green-700"
            onClick={() => navigate("/vendor-request", { replace: true })}
          >
            Complete Vendor Request
          </Button>
        )}

        {viewState === "pending" && (
          <p className="mb-4 text-xs text-slate-500">
            {isChecking
              ? "Checking latest status..."
              : "Status auto-refreshes every few seconds."}
          </p>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={handleBack}
          disabled={isLeaving}
        >
          {isLeaving ? "Returning to login..." : "Back to Login"}
        </Button>
      </div>
    </main>
  );
}
