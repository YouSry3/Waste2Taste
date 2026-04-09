import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  clearPendingVendorApprovalEmail,
  getPendingVendorApprovalEmail,
  getVendorRequestByEmail,
  setPendingVendorApprovalEmail,
  subscribeToVendorApprovalStore,
} from "../../services/vendorApproval/vendorApprovalStore";
import { authService } from "../../services/auth/authService";

type ApprovalViewState = "missing" | "pending" | "approved" | "rejected";

function HourglassIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <rect x="14" y="8" width="36" height="6" rx="3" fill="#C8B8F8" />
      <rect x="14" y="50" width="36" height="6" rx="3" fill="#C8B8F8" />
      <path d="M18 14 L32 34 L46 14 Z" fill="#DDD3FC" />
      <path d="M18 50 L32 36 L46 50 Z" fill="#A78BFA" className="animate-pulse" />
      <circle cx="32" cy="36" r="3" fill="#7C3AED" />
    </svg>
  );
}

function StepBadge({
  step,
  label,
  active,
}: {
  step: number;
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
          active
            ? "bg-violet-600 text-white shadow-md shadow-violet-200"
            : "bg-violet-100 text-violet-400"
        }`}
      >
        {active ? (
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          step
        )}
      </div>
      <span
        className={`text-xs font-medium ${active ? "text-violet-700" : "text-slate-400"}`}
      >
        {label}
      </span>
    </div>
  );
}

export default function PendingApprovalPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [dots, setDots] = useState(".");
  const [trackedEmail, setTrackedEmail] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setDots((current) => (current.length >= 3 ? "." : `${current}.`)),
      600,
    );

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const queryEmail = searchParams.get("email")?.trim() || "";
    const storedEmail = getPendingVendorApprovalEmail() || "";
    const effectiveEmail = queryEmail || storedEmail;

    if (queryEmail) {
      setPendingVendorApprovalEmail(queryEmail);
    }

    setTrackedEmail(effectiveEmail);
  }, [searchParams]);

  useEffect(() => {
    if (!trackedEmail) {
      return;
    }

    const syncRequestState = () => {
      setRefreshKey((current) => current + 1);
    };

    syncRequestState();
    const unsubscribe = subscribeToVendorApprovalStore(syncRequestState);

    const intervalId = setInterval(() => {
      setIsChecking(true);
      syncRequestState();
      setIsChecking(false);
    }, 8000);

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, [trackedEmail]);

  const request = useMemo(() => {
    if (!trackedEmail) {
      return null;
    }

    return getVendorRequestByEmail(trackedEmail);
  }, [trackedEmail, refreshKey]);

  const viewState: ApprovalViewState = useMemo(() => {
    if (!trackedEmail || !request) {
      return "missing";
    }

    if (request.status === "approved") {
      return "approved";
    }

    if (request.status === "rejected") {
      return "rejected";
    }

    return "pending";
  }, [trackedEmail, request]);

  useEffect(() => {
    if (viewState !== "approved") {
      return;
    }

    clearPendingVendorApprovalEmail();
    const redirectId = setTimeout(() => {
      navigate("/?panel=vendor", { replace: true });
    }, 1800);

    return () => clearTimeout(redirectId);
  }, [navigate, viewState]);

  const handleBackToLogin = async () => {
    setIsLoggingOut(true);
    authService.clearLocalAuth();
    await new Promise((resolve) => setTimeout(resolve, 300));
    navigate("/?panel=vendor", { replace: true });
  };

  const statusLabel =
    viewState === "approved"
      ? "Approved"
      : viewState === "rejected"
        ? "Rejected"
        : viewState === "pending"
          ? "Under Review"
          : "Not Found";

  const statusDescription =
    viewState === "approved"
      ? "Your vendor account has been approved. Redirecting you to login."
      : viewState === "rejected"
        ? request?.notes || "Your request was rejected. Please contact support."
        : viewState === "pending"
          ? "Your vendor account has been created successfully. Please wait until an admin reviews your request."
          : "We could not find a pending vendor request for this account.";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50 flex items-center justify-center p-4 font-sans">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-violet-100 opacity-50 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-purple-100 opacity-50 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl shadow-violet-100/50 border border-white/60 p-8 text-center">
          <div
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 ${
              viewState === "approved"
                ? "bg-green-50 border border-green-200 text-green-700"
                : viewState === "rejected"
                  ? "bg-red-50 border border-red-200 text-red-700"
                  : "bg-amber-50 border border-amber-200 text-amber-700"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                viewState === "approved"
                  ? "bg-green-500"
                  : viewState === "rejected"
                    ? "bg-red-500"
                    : "bg-amber-400 animate-pulse"
              }`}
            />
            {statusLabel}
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-violet-50 flex items-center justify-center border border-violet-100">
              <div className="w-10 h-10">
                <HourglassIcon />
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 mb-3">
            Vendor Approval Status
          </h1>

          <p className="text-slate-500 text-sm leading-relaxed mb-2 px-2">
            {statusDescription}
          </p>

          {trackedEmail && (
            <p className="text-xs text-violet-500 font-medium mb-6">{trackedEmail}</p>
          )}

          <div className="flex items-center justify-center gap-3 bg-slate-50 rounded-2xl px-4 py-3 mb-7 border border-slate-100">
            <StepBadge step={1} label="Registered" active={!!request} />
            <div className="flex-1 h-px bg-gradient-to-r from-violet-200 to-slate-200 mx-1" />
            <StepBadge step={2} label="Under Review" active={viewState === "pending"} />
            <div className="flex-1 h-px bg-slate-200 mx-1" />
            <StepBadge step={3} label="Approved" active={viewState === "approved"} />
          </div>

          {viewState === "pending" && (
            <p className="text-xs text-slate-400 mb-6">
              {isChecking ? "Checking status..." : `Checking automatically${dots}`}
            </p>
          )}

          <button
            onClick={handleBackToLogin}
            disabled={isLoggingOut}
            className="group w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:border-violet-200 hover:text-violet-600 hover:bg-violet-50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? "Returning to login..." : "Back to Login"}
          </button>
        </div>
      </div>
    </main>
  );
}
