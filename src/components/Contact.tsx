import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    projectDetails: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // For now, let's use a simple approach that logs the data
      // This will help us test the form while you set up EmailJS
      const emailData = {
        to: "arsh.c.contractors@gmail.com",
        from: formData.email,
        subject: "New Estimate Request - Arsh Contractors",
        message: `New Estimate Request from Arsh Contractors Website

Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}
Project Details: ${formData.projectDetails || "No details provided"}

Submitted on: ${new Date().toLocaleString()}`,
      };

      // Log the email data for now
      console.log("Email data that would be sent:", emailData);

      // Simulate successful submission
      // TODO: Replace this with actual EmailJS implementation
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      setSubmitStatus({
        type: "success",
        message:
          "Estimate request submitted successfully! We'll contact you soon.",
      });

      // Reset form on success
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        projectDetails: "",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus({
        type: "error",
        message: "Failed to submit request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section
      id="contact"
      className="section-padding bg-contractor-gray-light/30 smooth-scroll-target"
    >
      <div className="container-width">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
            Ready to Transform Your Home?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get in touch today for your free estimate. We're here to make your
            renovation dreams come true.
          </p>
        </div>

        <div className="flex justify-center">
          {/* Contact Form */}
          <Card className="contractor-card-gradient border-0 max-w-2xl w-full">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-foreground mb-6">
                Get Your Free Estimate
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      First Name *
                    </label>
                    <Input
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Last Name *
                    </label>
                    <Input
                      placeholder="Smith"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Phone *
                  </label>
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Project Details
                  </label>
                  <Textarea
                    placeholder="Tell us about your renovation project..."
                    className="min-h-32"
                    value={formData.projectDetails}
                    onChange={(e) =>
                      handleInputChange("projectDetails", e.target.value)
                    }
                  />
                </div>

                {/* Status Message */}
                {submitStatus.type && (
                  <div
                    className={`p-4 rounded-lg ${
                      submitStatus.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  className="w-full contractor-button-shadow"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Request Free Estimate"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
