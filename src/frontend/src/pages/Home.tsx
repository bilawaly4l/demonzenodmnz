import { GlossarySection } from "../components/GlossarySection";
import { HeroSection } from "../components/HeroSection";
import { TokenSectionCombined } from "../components/TokenSectionCombined";
import { TradingAcademySection } from "../components/TradingAcademySection";

export function Home() {
  return (
    <>
      <HeroSection />
      <TradingAcademySection />
      <div id="dmnz-token">
        <TokenSectionCombined />
      </div>
      <GlossarySection />
    </>
  );
}
