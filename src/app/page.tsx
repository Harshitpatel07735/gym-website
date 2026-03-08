import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import Programs from "@/components/sections/Programs";
import Activities from "@/components/sections/Activities";
import FeaturedVideo from "@/components/sections/FeaturedVideo";
import Trainers from "@/components/sections/Trainers";
import Stats from "@/components/sections/Stats";
import Pricing from "@/components/sections/Pricing";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import Gallery from "@/components/sections/Gallery";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import MembershipTracker from "@/components/sections/MembershipTracker";

export default function Home() {

    return (
        <main className="relative min-h-screen">
            <Hero />
            <Marquee />
            <About />
            <Programs />
            <Activities />
            <FeaturedVideo />
            <Trainers />
            <Stats />
            <Pricing />
            <Testimonials />
            <CTA />
            <Gallery />
            <MembershipTracker />
            <Contact />
            <Footer />
        </main>
    );
}
