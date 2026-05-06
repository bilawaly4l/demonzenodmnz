import { AmbassadorSection } from "../components/AmbassadorSection";
import { AskDemonZenoSection } from "../components/AskDemonZenoSection";
import { AuditReadinessSection } from "../components/AuditReadinessSection";
import { BewareOfFakesSection } from "../components/BewareOfFakesSection";
import { BinancePostsSection } from "../components/BinancePostsSection";
import { BondingCurveSection } from "../components/BondingCurveSection";
import { CharacterTraitsSection } from "../components/CharacterTraitsSection";
import { CommunityPledgeSection } from "../components/CommunityPledgeSection";
import { ContractRevealSection } from "../components/ContractRevealSection";
import { CredentialsSection } from "../components/CredentialsSection";
import { DDaySection } from "../components/DDaySection";
import { EarlyBelieverSection } from "../components/EarlyBelieverSection";
import { GlossarySection } from "../components/GlossarySection";
import { HeroSection } from "../components/HeroSection";
import { HolderBenefitsSection } from "../components/HolderBenefitsSection";
import { HypeWallSection } from "../components/HypeWallSection";
import { InteractiveRoadmapSection } from "../components/InteractiveRoadmapSection";
import { LaunchPriceMechanicsSection } from "../components/LaunchPriceMechanicsSection";
import { LegendSection } from "../components/LegendSection";
import { LetterToBelieverSection } from "../components/LetterToBelieverSection";
import { OriginStorySection } from "../components/OriginStorySection";
import { QuotesWallSection } from "../components/QuotesWallSection";
import { ReadinessChecklistSection } from "../components/ReadinessChecklistSection";
import { SmartContractSection } from "../components/SmartContractSection";
import { SupplyTransparencySection } from "../components/SupplyTransparencySection";
import { SurvivalGuideSection } from "../components/SurvivalGuideSection";
import { TokenComparisonSection } from "../components/TokenComparisonSection";
import { TokenomicsExplainerSection } from "../components/TokenomicsExplainerSection";
import { VerifiedProjectSection } from "../components/VerifiedProjectSection";
import { VillainArcSection } from "../components/VillainArcSection";
import { VisionSection } from "../components/VisionSection";
import { WhitepaperSection } from "../components/WhitepaperSection";

export function Home() {
  return (
    <>
      {/* 1. HERO */}
      <HeroSection />

      {/* 2. TOKEN — Fair launch, comparison, supply, bonding curve, launch mechanics */}
      <div id="token">
        <TokenomicsExplainerSection />
        <TokenComparisonSection />
        <SupplyTransparencySection />
        <BondingCurveSection />
        <LaunchPriceMechanicsSection />
        <HolderBenefitsSection />
        <SmartContractSection />
        <ContractRevealSection />
        <SurvivalGuideSection />
      </div>

      {/* 3. STORY — Legend, origin, villain arc, character traits, vision, quotes */}
      <div id="story">
        <LegendSection />
        <OriginStorySection />
        <VillainArcSection />
        <CharacterTraitsSection />
        <VisionSection />
        <QuotesWallSection />
      </div>

      {/* 4. CREDIBILITY — Whitepaper, verified, audit, beware of fakes */}
      <div id="credibility">
        <WhitepaperSection />
        <VerifiedProjectSection />
        <AuditReadinessSection />
        <BewareOfFakesSection />
      </div>

      {/* 5. AUTHORITY — Credentials, Binance posts, letter to believers */}
      <CredentialsSection />
      <BinancePostsSection />
      <LetterToBelieverSection />

      {/* 6. COMMUNITY — Early believers, pledge, ambassador, hype wall */}
      <div id="community">
        <EarlyBelieverSection />
        <CommunityPledgeSection />
        <AmbassadorSection />
        <HypeWallSection />
      </div>

      {/* 7. D-DAY countdown + readiness checklist */}
      <div id="dday">
        <DDaySection />
        <ReadinessChecklistSection />
      </div>

      {/* 8. ROADMAP */}
      <div id="roadmap">
        <InteractiveRoadmapSection />
      </div>

      {/* 9. FAQ */}
      <AskDemonZenoSection />

      {/* 10. GLOSSARY */}
      <GlossarySection />
    </>
  );
}
