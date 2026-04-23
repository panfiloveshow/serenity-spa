import dynamic from 'next/dynamic';
import { IslandNavbar } from '@/components/layout/IslandNavbar';
import { Footer } from '@/components/layout/Footer';
import { ModernHero } from '@/components/sections/ModernHero';
import { LazyDesktopEffects } from '../../components/ui/LazyDesktopEffects';
import { ScrollSection3D } from '@/components/ui/ScrollSection3D';
import { BotanicalLayer } from '@/components/ui/BotanicalLayer';
import { BookingProvider } from '@/lib/booking-context';
import { LazyBookingModal } from '@/components/ui/LazyBookingModal';
import { MobileStickyCTA } from '@/components/ui/MobileStickyCTA';
import { VisitorTracker } from '@/components/ui/VisitorTracker';

const BentoInfrastructure = dynamic(() =>
  import('@/components/sections/BentoInfrastructure').then((m) => ({
    default: m.BentoInfrastructure,
  }))
);

const HorizontalServices = dynamic(() =>
  import('@/components/sections/HorizontalServices').then((m) => ({
    default: m.HorizontalServices,
  }))
);

const StackedCardsPackages = dynamic(() =>
  import('@/components/sections/StackedCardsPackages').then((m) => ({
    default: m.StackedCardsPackages,
  }))
);

const ModernMembership = dynamic(() =>
  import('@/components/sections/ModernMembership').then((m) => ({
    default: m.ModernMembership,
  }))
);

const ContactsSection = dynamic(() =>
  import('@/components/sections/ContactsSection').then((m) => ({
    default: m.ContactsSection,
  }))
);

const TestimonialsSection = dynamic(() =>
  import('@/components/sections/TestimonialsSection').then((m) => ({
    default: m.TestimonialsSection,
  }))
);

export default async function Home() {
  return (
    <BookingProvider>
      <a
        href="#main"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:px-4 focus-visible:py-2 focus-visible:rounded-lg focus-visible:bg-[#C8956C] focus-visible:text-[#1B3A5C] focus-visible:font-semibold focus-visible:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8DFD0]"
      >
        Перейти к основному содержимому
      </a>
      <VisitorTracker />
      <div className="noise-overlay" />
      <LazyDesktopEffects />
      <LazyBookingModal />
      <MobileStickyCTA />

      <IslandNavbar />

      {/* Wrapper: sections + botanical layer share the same scroll context */}
      <div className="relative">
        {/* Botanical elements — absolute within the scroll flow, seamless across sections */}
        <BotanicalLayer />

        <main id="main" tabIndex={-1} className="relative z-10">
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

          <ScrollSection3D effect="rise">
            <TestimonialsSection />
          </ScrollSection3D>

          <ScrollSection3D effect="slide">
            <ContactsSection />
          </ScrollSection3D>
        </main>

        <Footer />
      </div>
    </BookingProvider>
  );
}
