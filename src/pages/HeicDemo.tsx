import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ImageUploadWithConversion from "@/components/ImageUploadWithConversion";
import { Badge } from "@/components/ui/badge";

const HeicDemo = () => {
  const handleImageReady = (file: File) => {
    console.log("Image ready for use:", file);
    // Here you would typically upload the file to your server
    // or process it further
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-width text-center">
            <Badge variant="secondary" className="mb-4">
              HEIC Support
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              HEIC Image <span className="text-primary">Conversion</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Automatically convert HEIC images from iPhones to web-compatible
              JPEG format. No more compatibility issues with your photo uploads.
            </p>
          </div>
        </section>

        {/* Demo Section */}
        <section className="section-padding pb-24">
          <div className="container-width max-w-4xl mx-auto">
            <ImageUploadWithConversion onImageReady={handleImageReady} />
          </div>
        </section>

        {/* Features Section */}
        <section className="section-padding bg-muted/30">
          <div className="container-width">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our silent conversion system handles HEIC images seamlessly
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-semibold">Upload HEIC</h3>
                <p className="text-muted-foreground">
                  Drag & drop or select HEIC files from your iPhone or other
                  devices
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold">Silent Conversion</h3>
                <p className="text-muted-foreground">
                  Files are converted to JPEG format automatically in the
                  background
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🌐</span>
                </div>
                <h3 className="text-xl font-semibold">Web Ready</h3>
                <p className="text-muted-foreground">
                  Converted images work perfectly on all browsers and devices
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section-padding">
          <div className="container-width max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Why Silent Conversion?
              </h2>
              <p className="text-lg text-muted-foreground">
                Better user experience without unnecessary interruptions
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-green-600">
                  ✅ Advantages
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• No user interruptions or notifications</li>
                  <li>• Seamless user experience</li>
                  <li>• Works offline</li>
                  <li>• Reduces server load</li>
                  <li>• Faster perceived performance</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-orange-600">
                  ⚠️ Considerations
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Uses device processing power</li>
                  <li>• May take longer on older devices</li>
                  <li>• Battery usage on mobile devices</li>
                  <li>• Memory usage during conversion</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HeicDemo;
