// hooks/useApprovalPolling.js
// Drop this hook anywhere and use it to auto-redirect when a pending vendor is approved.

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * useApprovalPolling
 *
 * Polls GET /api/auth/me every `intervalMs` milliseconds.
 * When the returned `status` changes to "approved", calls `onApproved` and
 * optionally redirects to `redirectTo`.
 *
 * @param {object}   options
 * @param {boolean}  options.enabled      – toggle polling on/off (default true)
 * @param {number}   options.intervalMs   – poll interval in ms (default 15 000)
 * @param {string}   options.redirectTo   – path to push when approved (default "/dashboard")
 * @param {function} options.onApproved   – optional callback fired on approval
 *
 * @returns {{ isChecking: boolean, lastChecked: Date|null }}
 */
export function useApprovalPolling({
  enabled = true,
  intervalMs = 15_000,
  redirectTo = "/dashboard",
  onApproved,
} = {}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  const checkStatus = useCallback(async () => {
    if (isChecking) return; // prevent overlapping requests
    setIsChecking(true);
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLastChecked(new Date());

      if (data?.status === "approved") {
        onApproved?.();
        router.push(redirectTo);
      }
    } catch (err) {
      console.warn("[useApprovalPolling] status check failed:", err.message);
    } finally {
      setIsChecking(false);
    }
  }, [isChecking, onApproved, redirectTo, router]);

  useEffect(() => {
    if (!enabled) return;
    // Run once immediately, then on the interval
    checkStatus();
    const id = setInterval(checkStatus, intervalMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, intervalMs]);

  return { isChecking, lastChecked };
}
