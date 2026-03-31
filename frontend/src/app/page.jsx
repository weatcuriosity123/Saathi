import HomeHero from "@/components/home/HomeHero";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import WhySaathi from "@/components/home/WhySaathi";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HomeHero />
      <FeaturedCourses />
      <WhySaathi />
      <CTASection />
      <HowItWorks />
      <Testimonials />
    </div>
  );
}
