import { MotionConfig } from "framer-motion";
import { SiteActionsProvider } from "@/context/site-actions";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Categories } from "@/components/sections/categories";
import { PartFinder } from "@/components/sections/part-finder";
import { MechanicsUniverse } from "@/components/sections/mechanics-universe";
import { Brands } from "@/components/sections/brands";
import { Headquarters } from "@/components/sections/headquarters";
import { Quote } from "@/components/sections/quote";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SiteActionsProvider>
        <Navbar />
        {/* The page is a sheet over the footer; it slides away at the end. */}
        <main id="contenido" className="relative z-10 bg-ink">
          <Hero />
          <Categories />
          <PartFinder />
          <MechanicsUniverse />
          <Brands />
          <Headquarters />
          <Quote />
        </main>
        <Footer />
      </SiteActionsProvider>
    </MotionConfig>
  );
}
