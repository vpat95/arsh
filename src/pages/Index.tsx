import About from "@/components/About";
import Contact from "@/components/Contact";
import ElfsightReviews from "@/components/ElfsightReviews";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Services />
        <ElfsightReviews />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
