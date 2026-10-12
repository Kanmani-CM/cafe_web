import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { contactService } from '../services/contactService';
import { useToast } from '../context/ToastContext';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) {
      errs.name = 'Please provide your name (at least 2 characters).';
    }
    if (!email.trim() || !email.includes('@')) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!subject.trim() || subject.trim().length < 2) {
      errs.subject = 'Please provide a subject.';
    }
    if (!message.trim() || message.trim().length < 10) {
      errs.message = 'Please write a message with at least 10 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      showToast('Please fix highlighted fields in your message.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await contactService.sendMessage({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        subject: subject.trim(),
        message: message.trim(),
      });

      setSubmitted(true);
      showToast('Your message has reached our team. We typically respond within 24 hours!', 'success', 'Message Sent');
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      setErrors({});
    } catch (err: any) {
      showToast(err.message || 'Failed to submit inquiry. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'Do you offer reservations for small groups?',
      a: 'Yes! You can reserve online for 1 to 12 guests through our Reservations page with instant confirmation.',
    },
    {
      q: 'Is there parking available nearby?',
      a: 'Yes, we provide 15 complimentary parking bays directly behind the café, plus ample metered street parking along Heritage Boulevard.',
    },
    {
      q: 'Do you cater to dairy-free or gluten-sensitive diets?',
      a: 'Absolutely. We offer oat, almond, and soy milks at no extra charge, alongside daily baked gluten-free pastries and clearly marked vegan brunch items.',
    },
    {
      q: 'Can I host a private event or roastery cupping session?',
      a: 'Yes, our sunlit patio and tasting room are available for private evening hire and morning coffee workshops. Send us an inquiry above!',
    },
  ];

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 text-left">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E0D3BE]/60 text-xs font-semibold uppercase tracking-wider text-[#734E41]">
          <MessageSquare className="w-3.5 h-3.5 text-[#C47D3C]" />
          <span>Connect With Our Team</span>
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#261611]">
          We'd Love to Hear From You
        </h1>
        <p className="text-base text-[#52352B] leading-relaxed font-light">
          Have an inquiry regarding private events, bean sourcing, wholesale partnerships, or just want to share feedback? Drop us a note below.
        </p>
      </div>

      {/* Main Grid: Form & Contact Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 bg-[#F5EFE6] rounded-3xl p-6 sm:p-10 border border-[#ECE2D0] shadow-md space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#261611]">
            Send an Inquiry
          </h2>

          {submitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs space-y-1">
              <strong className="block text-sm">Thank you! Message received.</strong>
              <p>Our management team will get back to your email shortly.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-[#734E41] mb-2">
                  Your Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Liam Sterling"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E0D3BE] text-sm text-[#261611] focus:outline-none focus:border-[#C47D3C]"
                  required
                />
                {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-[#734E41] mb-2">
                  Email Address *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="liam@example.com"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E0D3BE] text-sm text-[#261611] focus:outline-none focus:border-[#C47D3C]"
                  required
                />
                {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-phone" className="block text-xs font-semibold uppercase tracking-wider text-[#734E41] mb-2">
                  Phone (Optional)
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E0D3BE] text-sm text-[#261611] focus:outline-none focus:border-[#C47D3C]"
                />
              </div>

              <div>
                <label htmlFor="contact-subj" className="block text-xs font-semibold uppercase tracking-wider text-[#734E41] mb-2">
                  Subject *
                </label>
                <input
                  id="contact-subj"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Private event, Roastery inquiry..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E0D3BE] text-sm text-[#261611] focus:outline-none focus:border-[#C47D3C]"
                  required
                />
                {errors.subject && <p className="text-xs text-rose-600 mt-1">{errors.subject}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="contact-msg" className="block text-xs font-semibold uppercase tracking-wider text-[#734E41] mb-2">
                Your Message *
              </label>
              <textarea
                id="contact-msg"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we assist you?"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E0D3BE] text-sm text-[#261611] focus:outline-none focus:border-[#C47D3C]"
                required
              />
              {errors.message && <p className="text-xs text-rose-600 mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#261611] text-[#FAF7F2] hover:bg-[#38221B] font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Transmitting Message...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#DE9B56]" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Contact Cards & Map Link */}
        <div className="lg:col-span-5 space-y-6">
          {/* Details Card */}
          <div className="bg-[#F5EFE6] rounded-3xl p-6 sm:p-8 border border-[#ECE2D0] space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#261611]">
              Aurora Roastery & Kitchen
            </h3>

            <div className="space-y-4 text-sm text-[#52352B]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C47D3C] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#261611]">Address</strong>
                  <p>452 Heritage Boulevard, Historic Old Town, CA 94103</p>
                  <a
                    href="https://maps.google.com/?q=452+Heritage+Boulevard"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#C47D3C] font-semibold hover:underline mt-1"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#C47D3C] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#261611]">Phone & Reservations</strong>
                  <p>+1 (555) 321-9876</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#C47D3C] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#261611]">General Inquiries</strong>
                  <p>hello@auroracafe.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#C47D3C] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#261611]">Hours of Operation</strong>
                  <p className="text-xs leading-relaxed text-[#734E41]">
                    Mon – Fri: 7:00 AM – 9:00 PM<br />
                    Saturday: 7:30 AM – 10:00 PM<br />
                    Sunday: 8:00 AM – 8:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stylized Map Card */}
          <div className="rounded-3xl overflow-hidden border border-[#ECE2D0] shadow-md bg-[#261611] text-[#FAF7F2] p-6 relative">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-[#DE9B56] font-semibold">
                Finding Us
              </span>
              <h4 className="font-serif text-lg font-bold">
                Historic Old Town Arts District
              </h4>
              <p className="text-xs text-[#ECE2D0]/80 leading-relaxed font-light">
                Located next to the historic fountain plaza. Streetcar lines #4 and #12 stop directly in front of the café entrance.
              </p>
              <a
                href="https://maps.google.com/?q=Historic+Old+Town+Arts+District"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#DE9B56] text-[#261611] font-semibold text-xs hover:bg-[#C47D3C] transition-colors mt-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Get Interactive Directions</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ SECTION */}
      <section className="space-y-8 pt-8 border-t border-[#ECE2D0]">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#C47D3C] font-semibold flex items-center justify-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Common Questions</span>
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#261611]">
            Frequently Asked Inquiries
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#F5EFE6] p-6 rounded-2xl border border-[#ECE2D0] space-y-2"
            >
              <h3 className="font-serif text-base font-bold text-[#261611]">
                {faq.q}
              </h3>
              <p className="text-xs text-[#52352B] leading-relaxed font-light">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
