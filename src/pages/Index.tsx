import About from "@/components/About";
import Contact from "@/components/Contact";
import ElfsightReviews from "@/components/ElfsightReviews";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HomepageGallery from "@/components/HomepageGallery";
import Services from "@/components/Services";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ElfsightReviews />
        <HomepageGallery />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
