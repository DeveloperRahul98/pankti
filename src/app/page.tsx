import { Hero } from "@/components/landing/hero";
import { AvailabilityStrip } from "@/components/landing/availability-strip";
import { OccasionPicker } from "@/components/landing/occasion-picker";
import { SignaturePlatesSection } from "@/components/landing/signature-plates-section";
import { FeaturedInStrip } from "@/components/landing/featured-in-strip";
import { HowItWorks } from "@/components/landing/how-it-works";
import { RecipeOfWeek } from "@/components/landing/recipe-of-week";
import { GalleryPreview } from "@/components/landing/gallery-preview";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FestivalCalendar } from "@/components/landing/festival-calendar";
import { CtaSection } from "@/components/landing/cta-section";
import { SavedPlatesSection } from "@/components/plate/saved-plates-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AvailabilityStrip />
      <SavedPlatesSection />
      <OccasionPicker />
      <SignaturePlatesSection />
      <FeaturedInStrip />
      <HowItWorks />
      <RecipeOfWeek />
      <GalleryPreview />
      <TestimonialsSection />
      <FestivalCalendar />
      <CtaSection />
    </>
  );
}
