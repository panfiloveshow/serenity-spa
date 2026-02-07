import { IslandNavbar } from '@/components/layout/IslandNavbar';
import { Footer } from '@/components/layout/Footer';
import { ModernHero } from '@/components/sections/ModernHero';
import { BentoInfrastructure } from '@/components/sections/BentoInfrastructure';
import { HorizontalServices } from '@/components/sections/HorizontalServices';
import { StackedCardsPackages } from '@/components/sections/StackedCardsPackages';
import { ModernMembership } from '@/components/sections/ModernMembership';
import { ContactsSection } from '@/components/sections/ContactsSection';
import { InstagramFeed } from '@/components/sections/InstagramFeed';
import { VelocityCursor } from '@/components/ui/VelocityCursor';
import { FluidBackground } from '@/components/ui/FluidBackground';
import { ScrollSection3D } from '@/components/ui/ScrollSection3D';
import { BotanicalLayer } from '@/components/ui/BotanicalLayer';
import { BookingProvider } from '@/lib/booking-context';
import { BookingModal } from '@/components/ui/BookingModal';

export default function Home() {
  return (
    <BookingProvider>
      <div className="noise-overlay" />
      <VelocityCursor />
      <FluidBackground />
      <BookingModal />

      <IslandNavbar />
      
      {/* Wrapper: sections + botanical layer share the same scroll context */}
      <div className="relative">
        {/* Botanical elements — absolute within the scroll flow, seamless across sections */}
        <BotanicalLayer />

        <main className="relative z-10">
          <ModernHero />
          
          <ScrollSection3D effect="rise">
            <BentoInfrastructure />
          </ScrollSection3D>
          
          <ScrollSection3D effect="tilt">
            <HorizontalServices />
          </ScrollSection3D>
          
          <ScrollSection3D effect="zoom">
            <StackedCardsPackages />
          </ScrollSection3D>
          
          <ScrollSection3D effect="flip">
            <ModernMembership />
          </ScrollSection3D>
          
          {/* Instagram feed temporarily hidden */}
          {/* <ScrollSection3D effect="rise">
            <InstagramFeed />
          </ScrollSection3D> */}

          <ScrollSection3D effect="slide">
            <ContactsSection />
          </ScrollSection3D>
        </main>

        <Footer />
      </div>
    </BookingProvider>
  );
}
