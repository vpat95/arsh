import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import GoogleReviews from "@/components/GoogleReviews";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <GoogleReviews />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
