import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedProperties } from "@/components/FeaturedProperties";
import { WhatsAppGroups } from "@/components/WhatsAppGroups";
import { CTASection } from "@/components/CTASection";
import { EventsCalendar } from "@/components/EventsCalendar";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedProperties />
        <WhatsAppGroups />
        <CTASection />
        <EventsCalendar />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
