import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  Mail,
  User,
  MessageSquare,
  ShieldCheck,
  Download,
  Utensils,
} from 'lucide-react';
import { reservationService } from '../services/reservationService';
import { AvailableSlot, Reservation } from '../types';
import { useToast } from '../context/ToastContext';

interface ReservationPageProps {
  navigate: (path: string) => void;
}

export const ReservationPage: React.FC<ReservationPageProps> = ({ navigate }) => {
  const { showToast } = useToast();

  // Today's date formatted as YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Form State
  const [date, setDate] = useState<string>(todayStr);
  const [guestCount, setGuestCount] = useState<number>(2);
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [specialNotes, setSpecialNotes] = useState<string>('');

  // Availability State
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Submission State
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  // Fetch slots whenever date or guestCount changes
  useEffect(() => {
    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSlotsError(null);
      try {
        const slots = await reservationService.getAvailableSlots(date, guestCount);
        setAvailableSlots(slots);

        // If previously selected time slot is now unavailable, deselect it
        if (timeSlot) {
          const match = slots.find((s) => s.timeSlot === timeSlot);
          if (!match || !match.available) {
            setTimeSlot('');
          }
        }
      } catch (err: any) {
        setSlotsError(err.message || 'Unable to check time slot availability.');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [date, guestCount]);

  // Frontend Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!customerName.trim() || customerName.trim().length < 2) {
      errors.customerName = 'Please enter your full name (at least 2 characters).';
    }

    if (!customerEmail.trim() || !customerEmail.includes('@') || !customerEmail.includes('.')) {
      errors.customerEmail = 'Please provide a valid email address.';
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 7) {
      errors.customerPhone = 'Please provide a valid contact phone number.';
    }

    if (!date) {
      errors.date = 'Please select a reservation date.';
    }

    if (!timeSlot) {
      errors.timeSlot = 'Please select an available dining time slot.';
    }

    if (!guestCount || guestCount < 1 || guestCount > 12) {
      errors.guestCount = 'Party size must be between 1 and 12 guests.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please correct the highlighted fields before submitting.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const reservation = await reservationService.bookTable({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        date,
        timeSlot,
        guestCount,
        specialNotes: specialNotes.trim() || undefined,
      });

      setConfirmedReservation(reservation);
      showToast('Table reserved successfully! A confirmation reference has been generated.', 'success', 'Booking Confirmed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      const msg = err.message || 'Reservation booking failed. Please try an alternative time slot.';
      showToast(msg, 'error', 'Booking Notice');
      if (err.errors) {
        const fieldErrors: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(err.errors)) {
          fieldErrors[key] = (msgs as string[])[0];
        }
        setFormErrors(fieldErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadConfirmation = () => {
    if (!confirmedReservation) return;
    const content = `AURORA CAFÉ & ROASTERY - RESERVATION CONFIRMATION
--------------------------------------------------
Confirmation Ref : ${confirmedReservation.referenceNumber}
Guest Name       : ${confirmedReservation.customerName}
Party Size       : ${confirmedReservation.guestCount} Guest(s)
Date             : ${confirmedReservation.date}
Time Slot        : ${confirmedReservation.timeSlot}
Assigned Table   : ${confirmedReservation.table ? `Table #${confirmedReservation.table.tableNumber} (${confirmedReservation.table.location})` : 'Reserved'}
Status           : ${confirmedReservation.status}
Special Requests : ${confirmedReservation.specialNotes || 'None'}
--------------------------------------------------
Location         : 452 Heritage Boulevard, Historic Old Town, CA 94103
Phone            : +1 (555) 321-9876
Email            : hello@auroracafe.com

Please arrive 5-10 minutes prior to your reservation time. We hold tables for up to 15 minutes past the reserved slot.
Thank you for dining with Aurora Café!`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Aurora-Reservation-${confirmedReservation.referenceNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // SUCCESS CONFIRMATION VIEW
  if (confirmedReservation) {
    return (
      <div className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8 animate-fadeIn">
        <div className="bg-[#F5EFE6] rounded-3xl p-8 sm:p-10 border border-[#ECE2D0] shadow-xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="text-xs uppercase tracking-widest font-semibold text-emerald-800">
              Reservation Confirmed & Guaranteed
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#261611]">
              We Look Forward to Welcoming You!
            </h1>
            <p className="text-sm text-[#52352B] max-w-md mx-auto">
              A table has been secured for your party. Please retain your booking reference code below.
            </p>
          </div>

          {/* Reference Card */}
          <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E0D3BE] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#ECE2D0] gap-2">
              <div>
                <span className="text-xs uppercase text-[#734E41] font-semibold">Booking Reference</span>
                <p className="font-mono text-xl sm:text-2xl font-bold text-[#C47D3C]">
                  {confirmedReservation.referenceNumber}
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold self-start sm:self-auto">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{confirmedReservation.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-[#734E41]">Date & Time</span>
                <p className="font-semibold text-[#261611]">
                  {confirmedReservation.date} at {confirmedReservation.timeSlot}
                </p>
              </div>

              <div>
                <span className="text-xs text-[#734E41]">Party Size</span>
                <p className="font-semibold text-[#261611]">
                  {confirmedReservation.guestCount} {confirmedReservation.guestCount === 1 ? 'Guest' : 'Guests'}
                </p>
              </div>

              <div>
                <span className="text-xs text-[#734E41]">Guest Name</span>
                <p className="font-semibold text-[#261611]">
                  {confirmedReservation.customerName}
                </p>
              </div>

              <div>
                <span className="text-xs text-[#734E41]">Assigned Seating</span>
                <p className="font-semibold text-[#261611]">
                  {confirmedReservation.table
                    ? `Table #${confirmedReservation.table.tableNumber} (${confirmedReservation.table.location})`
                    : 'Reserved Area'}
                </p>
              </div>
            </div>

            {confirmedReservation.specialNotes && (
              <div className="pt-3 border-t border-[#ECE2D0]">
                <span className="text-xs text-[#734E41]">Special Notes:</span>
                <p className="text-xs text-[#52352B] italic mt-0.5">
                  "{confirmedReservation.specialNotes}"
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              onClick={handleDownloadConfirmation}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#FAF7F2] text-[#261611] border border-[#E0D3BE] hover:bg-[#ECE2D0] text-xs font-semibold"
            >
              <Download className="w-4 h-4 text-[#C47D3C]" />
              <span>Download Confirmation Slip</span>
            </button>

            <div className="w-full sm:w-auto flex items-center gap-3">
              <button
                onClick={() => {
                  setConfirmedReservation(null);
                  setDate(todayStr);
                  setTimeSlot('');
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-full border border-[#E0D3BE] text-[#52352B] hover:bg-[#ECE2D0] text-xs font-semibold"
              >
                Book Another Table
              </button>

              <button
                onClick={() => navigate('/menu')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#261611] text-[#FAF7F2] hover:bg-[#38221B] text-xs font-semibold shadow-md"
              >
                <Utensils className="w-4 h-4 text-[#DE9B56]" />
                <span>Explore Menu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STANDARD RESERVATION FORM
  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0D3BE]/60 text-xs font-semibold uppercase tracking-wider text-[#734E41]">
          <Sparkles className="w-3.5 h-3.5 text-[#C47D3C]" />
          <span>Warm Hospitality Awaits</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#261611]">
          Reserve Your Table
        </h1>
        <p className="text-base text-[#52352B] leading-relaxed font-light">
          Whether joining us for morning coffee & warm croissants or an unhurried weekend brunch, reserve your table in advance to ensure preferred seating.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: The Interactive Reservation Form */}
        <div className="lg:col-span-8 bg-[#F5EFE6] rounded-3xl p-6 sm:p-10 border border-[#ECE2D0] shadow-md space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {/* SECTION 1: Date & Party Size */}
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-[#261611] flex items-center gap-2 pb-2 border-b border-[#ECE2D0]">
                <Calendar className="w-5 h-5 text-[#C47D3C]" />
                <span>1. Select Date & Party Size</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="res-date" className="block text-xs font-semibold uppercase tracking-wider text-[#734E41] mb-2">
                    Reservation Date *
                  </label>
                  <input
                    id="res-date"
                    type="date"
                    min={todayStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#E0D3BE] text-sm text-[#261611] focus:outline-none focus:border-[#C47D3C] focus:ring-1 focus:ring-[#C47D3C]"
                    required
                  />
                  {formErrors.date && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{formErrors.date}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="res-guests" className="block text-xs font-semibold uppercase tracking-wider text-[#734E41] mb-2">
                    Number of Guests *
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-[#734E41] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      id="res-guests"
                      value={guestCount}
                      onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#E0D3BE] text-sm text-[#261611] focus:outline-none focus:border-[#C47D3C] focus:ring-1 focus:ring-[#C47D3C]"
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formErrors.guestCount && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{formErrors.guestCount}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 2: Dynamic Time Slot Selector */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#ECE2D0]">
                <h2 className="font-serif text-xl font-bold text-[#261611] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#C47D3C]" />
                  <span>2. Choose Seating Time Slot *</span>
                </h2>
                {loadingSlots && (
                  <span className="text-xs text-[#734E41] animate-pulse">
                    Checking live availability...
                  </span>
                )}
              </div>

              {slotsError && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                  {slotsError}
                </div>
              )}

              {/* Slots Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {availableSlots.map((slot) => {
                  const isSelected = timeSlot === slot.timeSlot;
                  const isAvailable = slot.available;

                  return (
                    <button
                      key={slot.timeSlot}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setTimeSlot(slot.timeSlot)}
                      className={`p-2.5 rounded-xl text-center border transition-all text-xs flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-[#261611] text-[#FAF7F2] border-[#261611] shadow-md scale-105'
                          : isAvailable
                          ? 'bg-[#FAF7F2] text-[#261611] border-[#E0D3BE] hover:border-[#C47D3C] hover:bg-[#ECE2D0]'
                          : 'bg-[#ECE2D0]/40 text-[#734E41]/40 border-transparent cursor-not-allowed opacity-50'
                      }`}
                      title={
                        isAvailable
                          ? `${slot.remainingTables} table(s) available`
                          : slot.reason || 'Fully Booked'
                      }
                    >
                      <span className="font-semibold text-sm">{slot.timeSlot}</span>
                      <span className="text-[10px]">
                        {isAvailable ? `${slot.remainingTables} left` : 'Full'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {formErrors.timeSlot && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{formErrors.timeSlot}</span>
                </p>
              )}
            </div>

            {/* SECTION 3: Contact Details */}
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-[#261611] flex items-center gap-2 pb-2 border-b border-[#ECE2D0]">
                <User className="w-5 h-5 text-[#C47D3C]" />
                <span>3. Guest Contact Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label htmlFor="res-name" className="block text-xs font-semibold uppercase tracking-wider text-[#734E41] mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#734E41] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="res-name"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E0D3BE] text-sm text-[#261611] focus:outline-none focus:border-[#C47D3C]"
                      required
                    />
                  </div>
                  {formErrors.customerName && (
                    <p className="text-xs text-rose-600 mt-1">{formErrors.customerName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="res-email" className="block text-xs font-semibold uppercase tracking-wider text-[#734E41] mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#734E41] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="res-email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="eleanor@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E0D3BE] text-sm text-[#261611] focus:outline-none focus:border-[#C47D3C]"
                      required
                    />
                  </div>
                  {formErrors.customerEmail && (
                    <p className="text-xs text-rose-600 mt-1">{formErrors.customerEmail}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="res-phone" className="block text-xs font-semibold uppercase tracking-wider text-[#734E41] mb-2">
                    Contact Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#734E41] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="res-phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E0D3BE] text-sm text-[#261611] focus:outline-none focus:border-[#C47D3C]"
                      required
                    />
                  </div>
                  {formErrors.customerPhone && (
                    <p className="text-xs text-rose-600 mt-1">{formErrors.customerPhone}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="res-notes" className="block text-xs font-semibold uppercase tracking-wider text-[#734E41] mb-2">
                  Special Notes / Dietary Requirements (Optional)
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-[#734E41] absolute left-3.5 top-3.5 pointer-events-none" />
                  <textarea
                    id="res-notes"
                    rows={3}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="E.g., Window seating preferred, celebrating a birthday, high chair required..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E0D3BE] text-sm text-[#261611] focus:outline-none focus:border-[#C47D3C]"
                    maxLength={500}
                  />
                </div>
                <div className="text-right text-[11px] text-[#734E41]/70 mt-1">
                  {specialNotes.length}/500 characters
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-[#ECE2D0]">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-8 rounded-full bg-[#261611] text-[#FAF7F2] hover:bg-[#38221B] font-semibold text-base shadow-xl hover:shadow-2xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 transform active:scale-98"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Allocating Table & Reserving...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 text-[#DE9B56]" />
                    <span>Confirm Table Reservation</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Reservation Policy & Highlights */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#F5EFE6] rounded-3xl p-6 sm:p-8 border border-[#ECE2D0] space-y-5">
            <h3 className="font-serif text-lg font-bold text-[#261611]">
              Reservation Guidelines
            </h3>

            <ul className="space-y-3.5 text-xs text-[#52352B] leading-relaxed">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Grace Period:</strong> We hold tables for up to 15 minutes past your scheduled reservation time.
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Party Sizes:</strong> Online bookings accommodate up to 12 guests. For private events or buyouts, please message us.
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Cancellations:</strong> If your plans change, you can contact us or call to release your table for fellow guests.
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Walk-ins:</strong> We always preserve a selection of bar seats and patio tables for spontaneous walk-in guests!
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Contact Box */}
          <div className="bg-[#261611] text-[#FAF7F2] rounded-3xl p-6 sm:p-8 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#DE9B56] font-semibold">
              Need Immediate Assistance?
            </span>
            <h4 className="font-serif text-lg font-bold">
              Call Our Host Stand
            </h4>
            <p className="text-xs text-[#ECE2D0]/80 leading-relaxed font-light">
              For same-hour availability or large celebrations:
            </p>
            <div className="text-sm font-semibold text-[#DE9B56] flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 321-9876</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
