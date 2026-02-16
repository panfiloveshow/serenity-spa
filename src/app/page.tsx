import { IslandNavbar } from '@/components/layout/IslandNavbar';
import { Footer } from '@/components/layout/Footer';
import { ModernHero } from '@/components/sections/ModernHero';
import { BentoInfrastructure } from '@/components/sections/BentoInfrastructure';
import { HorizontalServices } from '@/components/sections/HorizontalServices';
import { StackedCardsPackages } from '@/components/sections/StackedCardsPackages';
import { ModernMembership } from '@/components/sections/ModernMembership';
import { ContactsSection } from '@/components/sections/ContactsSection';
import { LazyDesktopEffects } from '../components/ui/LazyDesktopEffects';
import { ScrollSection3D } from '@/components/ui/ScrollSection3D';
import { BotanicalLayer } from '@/components/ui/BotanicalLayer';
import { BookingProvider } from '@/lib/booking-context';
import { LazyBookingModal } from '@/components/ui/LazyBookingModal';
import { VisitorTracker } from '@/components/ui/VisitorTracker';

export default function Home() {
  return (
    <BookingProvider>
      <VisitorTracker />
      <div className="noise-overlay" />
      <LazyDesktopEffects />
      <LazyBookingModal />

      <IslandNavbar />
      
      {/* Wrapper: sections + botanical layer share the same scroll context */}
      <div className="relative">
        {/* Botanical elements — absolute within the scroll flow, seamless across sections */}
        <BotanicalLayer />

        <main className="relative z-10">
          <h1 className="sr-only">Serenity Spa — премиальный спа-центр в Ташкенте</h1>
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
