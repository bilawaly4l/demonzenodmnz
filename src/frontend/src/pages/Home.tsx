import { HeroSection } from "../components/HeroSection";
import { TokenSectionCombined } from "../components/TokenSectionCombined";
import { TradingAcademySection } from "../components/TradingAcademySection";
import { WhitepaperSection } from "../components/WhitepaperSection";

export function Home() {
  return (
    <>
      <HeroSection />
      <TradingAcademySection />
      <div id="dmnz-token">
        <TokenSectionCombined />
      </div>
      <WhitepaperSection />
    </>
  );
}
