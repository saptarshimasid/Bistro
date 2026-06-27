import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  Phone, 
  Users, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Clock3, 
  UserPlus,
  Info 
} from 'lucide-react';
import { Reservation } from '../types';

interface ReservationViewProps {
  reservations: Reservation[];
  onAddReservation: (res: Omit<Reservation, 'id' | 'createdAt'>) => void;
  onUpdateReservationStatus: (resId: string, status: 'Confirmed' | 'Pending' | 'Cancelled') => void;
  onSeatReservedGuest: (customerName: string, guestsCount: number, prefTableNumber: number) => void;
  themeStyle: 'gold' | 'platinum';
}

export default function ReservationView({
  reservations,
  onAddReservation,
  onUpdateReservationStatus,
  onSeatReservedGuest,
  themeStyle
}: ReservationViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'All' | 'Confirmed' | 'Pending' | 'Cancelled'>('All');
  
  // Form modal controller
  const [showAddModal, setShowAddModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('19:00');
  const [guests, setGuests] = useState(4);
  const [tablePreference, setTablePreference] = useState('Table 3');

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !date || !time) {
      alert('Please fill out all reservation parameters.');
      return;
    }

    onAddReservation({
      customerName,
      phone,
      date,
      time,
      guests,
      tablePreference,
      status: 'Confirmed'
    });

    // Reset Form
    setCustomerName('');
    setPhone('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('19:00');
    setGuests(4);
    setTablePreference('Table 3');
    setShowAddModal(false);
  };

  const filteredReservations = reservations.filter((res) => {
    const matchesFilter = filter === 'All' || res.status === filter;
    const matchesSearch = res.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.phone.includes(searchQuery) ||
                          res.tablePreference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 font-sans">
      
      {/* 1. Header controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4" id="reservations-controls">
        {/* Left Side: Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none w-4 h-4 my-auto" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reservations ledger..."
              className="w-full bg-[#121215] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2 pl-9 pr-4 text-xs text-white"
            />
          </div>

          {/* Filter switches */}
          <div className="flex gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {(['All', 'Confirmed', 'Pending', 'Cancelled'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  filter === opt
                    ? 'bg-amber-500/15 border border-gold-500/25 text-gold-500'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Add booking button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto px-4 py-2.5 bg-gradient-to-r from-gold-500 to-amber-600 text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-gold-500/10 cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Table Booking</span>
        </button>
      </div>

      {/* 2. Ledger List of Reservations */}
      <div className="glass-card rounded-2xl overflow-hidden" id="reservations-table-wrapper">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-left border-collapse">
            <thead>
              <tr className="bg-[#121215] border-b border-white/5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <th className="p-4">Customer Details</th>
                <th className="p-4">Seated Schedule</th>
                <th className="p-4">Party Size</th>
                <th className="p-4">Preference</th>
                <th className="p-4">Booking Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Seating Seated Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-transparent text-xs text-gray-300">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-500">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-35" />
                    <span>No reservations found in search filter.</span>
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => {
                  let statusBadge = 'bg-blue-500/10 text-blue-400 border-blue-500/15';
                  if (res.status === 'Confirmed') statusBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15';
                  if (res.status === 'Cancelled') statusBadge = 'bg-red-500/10 text-red-400 border-red-500/15';

                  return (
                    <tr key={res.id} className="hover:bg-white/[0.01] transition-colors">
                      {/* Customer Details */}
                      <td className="p-4">
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-white text-sm">{res.customerName}</span>
                          <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5 font-mono">
                            <Phone className="w-3 h-3 text-gold-500" />
                            {res.phone}
                          </span>
                        </div>
                      </td>

                      {/* Seated Schedule */}
                      <td className="p-4">
                        <div className="flex flex-col text-left font-mono">
                          <span className="text-gray-200">{res.date}</span>
                          <span className="text-gold-500 font-semibold text-[11px] flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-gold-500" />
                            {res.time}
                          </span>
                        </div>
                      </td>

                      {/* Party size */}
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg font-mono text-white">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          <span>{res.guests} Pax</span>
                        </span>
                      </td>

                      {/* Pref Table */}
                      <td className="p-4">
                        <span className="text-gray-400 font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gold-500" />
                          {res.tablePreference}
                        </span>
                      </td>

                      {/* Created date */}
                      <td className="p-4">
                        <span className="font-mono text-gray-500 text-[10px]">
                          {new Date(res.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 border rounded-lg ${statusBadge}`}>
                          {res.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {res.status === 'Pending' && (
                            <button
                              onClick={() => onUpdateReservationStatus(res.id, 'Confirmed')}
                              className="p-1.5 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg transition-colors cursor-pointer"
                              title="Approve booking"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          
                          {res.status !== 'Cancelled' && (
                            <>
                              <button
                                onClick={() => {
                                  // Parse table number from tablePreference e.g. "Table 3" -> 3. Fallback to 1.
                                  const tableNumMatch = res.tablePreference.match(/\d+/);
                                  const tableNum = tableNumMatch ? parseInt(tableNumMatch[0]) : 3;
                                  
                                  onSeatReservedGuest(res.customerName, res.guests, tableNum);
                                  onUpdateReservationStatus(res.id, 'Confirmed');
                                }}
                                className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/15 border border-gold-500/30 text-gold-500 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                                title="Seat immediately"
                              >
                                <UserPlus className="w-3.5 h-3.5" />
                                <span>Seat Guest</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  if (confirm(`Do you wish to cancel booking for ${res.customerName}?`)) {
                                    onUpdateReservationStatus(res.id, 'Cancelled');
                                  }
                                }}
                                className="p-1.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/15 text-red-400 rounded-lg transition-colors cursor-pointer"
                                title="Cancel booking"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {res.status === 'Cancelled' && (
                            <span className="text-[10px] text-gray-500 font-mono">Cancelled</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. New Reservation Addition Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md glass-card p-6 rounded-2xl relative text-left glow-gold"
              id="add-res-modal"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Record Table Reservation</h3>
                  <p className="text-xs text-gray-400 font-sans">Seating schedule reservation form</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateReservation} className="space-y-4">
                {/* Guest Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Guest Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-3.5 text-sm text-white font-sans"
                    placeholder="Marcus Aurelius"
                  />
                </div>

                {/* Phone Contact */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Phone Contact</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 pl-11 pr-3.5 text-sm text-white font-mono"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Date Schedule</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-3 text-xs text-white font-mono"
                    />
                  </div>

                  {/* Time */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Time Arrival</label>
                    <input
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-3 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Party Size */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Party Head Count</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      required
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-3 text-sm text-white font-mono"
                      placeholder="4"
                    />
                  </div>

                  {/* Table Preference */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Table Preference</label>
                    <select
                      value={tablePreference}
                      onChange={(e) => setTablePreference(e.target.value)}
                      className="w-full bg-[#0e0e11] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-2 text-xs text-white cursor-pointer"
                    >
                      <option value="Table 1">Table 1 (2 Pax)</option>
                      <option value="Table 3">Table 3 (4 Pax)</option>
                      <option value="Table 4">Table 4 (4 Pax)</option>
                      <option value="Table 9">Table 9 (Private Room)</option>
                      <option value="Table 12">Table 12 (10 Pax)</option>
                      <option value="Window Seat">Window Seat</option>
                      <option value="Near Bar">Near Bar</option>
                    </select>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-white/5 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-gradient-to-r from-gold-500 to-amber-600 text-black font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-gold-500/10 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Approve & Book</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
