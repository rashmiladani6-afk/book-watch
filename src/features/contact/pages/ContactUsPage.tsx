import { useState } from "react";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { contactService } from "@/features/contact/services/contactService";
import { isValidEmail } from "@/shared/utils/validators";
import { toast } from "sonner";
import { Loader2, Mail, MessageSquare, User } from "lucide-react";

const ContactUsPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await contactService.submitContact({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        description: description.trim(),
      });

      if (result.status !== "success") {
        toast.error(result.message || "Could not send message. Please try again.");
        return;
      }

      toast.success(result.message || "Message submitted successfully");
      setName("");
      setEmail("");
      setSubject("");
      setDescription("");
    } catch {
      toast.error("Could not send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-2xl py-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="mt-2 text-muted-foreground">
            Have a question about events or bookings? Send us a message and we will get back to you.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border bg-card p-6 shadow-sm space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="contact-name">Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="contact-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-subject">Subject</Label>
            <Input
              id="contact-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What is this about?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-description">Message</Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="contact-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write your message here..."
                className="min-h-[140px] pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send message"
            )}
          </Button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUsPage;
