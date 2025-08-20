import About from "@/components/About";
import Contact from "@/components/Contact";
import ElfsightReviews from "@/components/ElfsightReviews";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ElfsightReviews />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
