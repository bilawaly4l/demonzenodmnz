import { HeroSection } from "../components/HeroSection";
import { TokenSectionCombined } from "../components/TokenSectionCombined";

export function Home() {
  return (
    <>
      <HeroSection />
      <div id="dmnz-token">
        <TokenSectionCombined />
      </div>
    </>
  );
}
