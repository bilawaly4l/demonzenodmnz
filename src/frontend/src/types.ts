import type {
  AnnouncementBanner,
  RoadmapMilestone,
  TokenInfo,
} from "./backend";

export type { AnnouncementBanner, RoadmapMilestone, TokenInfo };

// ─── Admin Session ────────────────────────────────────────────────────────────

export interface AdminSessionContextValue {
  isAdminUnlocked: boolean;
  adminClickCount: number;
  showPasscodeModal: boolean;
  onHeroImageClick: () => void;
  submitPasscode: (passcode: string) => boolean;
  dismissModal: () => void;
  lockAdmin: () => void;
}
