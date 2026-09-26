import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import AboutSection from './sections/AboutSection';
import ServicesSection from './sections/ServicesSection';
import RoadmapSection from './sections/RoadmapSection';
import TrustSection from './sections/TrustSection';
import ProjectsSection from './sections/ProjectsSection';
import ContactCtaSection from './sections/ContactCtaSection';

export default function App() {
  return (
    <main className="bg-[#0C0C0C]" style={{ overflowX: 'clip' }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <RoadmapSection />
      <TrustSection />
      <ProjectsSection />
      <ContactCtaSection />
    </main>
  );
}
