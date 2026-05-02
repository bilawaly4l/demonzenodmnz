import { useSession } from "../contexts/SessionContext";
import { AdminPasscodeModal } from "./AdminPasscodeModal";

/**
 * AdminGuard — standalone click-trigger wrapper.
 * Wrap the DemonZeno character image with this; clicking it 5+ times
 * will open the passcode modal. Once unlocked SessionContext stores the
 * flag and AdminDashboard shows the full UI.
 */
export function AdminGuard({ children }: { children?: React.ReactNode }) {
  const { isAdminUnlocked, showPasscodeModal, onHeroImageClick, dismissModal } =
    useSession();

  return (
    <span className="relative inline-block">
      {/* Passcode modal */}
      <AdminPasscodeModal
        open={showPasscodeModal}
        onSuccess={() => {
          /* SessionContext already updated */
        }}
        onClose={dismissModal}
      />

      {/* Clickable wrapper — triggers unlock flow */}
      <button
        type="button"
        tabIndex={isAdminUnlocked ? -1 : 0}
        data-ocid="admin_guard.click_target"
        onClick={isAdminUnlocked ? undefined : onHeroImageClick}
        aria-label="DemonZeno"
        className="block bg-transparent border-0 p-0 cursor-pointer"
      >
        {children}
      </button>
    </span>
  );
}
