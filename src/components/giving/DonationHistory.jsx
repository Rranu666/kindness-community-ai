import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CAUSES = ["Hunger & Food Security", "Climate & Reforestation", "Clean Water Access", "Education & Children", "Health & Medical Aid", "Ocean Conservation"];
const CHARITIES = {
  "Hunger & Food Security":  ["Feeding America", "World Food Programme"],
  "Climate & Reforestation": ["One Tree Planted", "Arbor Day Foundation"],
  "Clean Water Access":      ["Water.org", "charity: water"],
  "Education & Children":    ["Save the Children", "Room to Read"],
  "Health & Medical Aid":    ["Partners in Health", "UNICEF"],
  "Ocean Conservation":      ["Ocean Conservancy", "Surfrider Foundation"],
};
const TYPE_LABELS = { giving_plan: "Giving Plan", roundup: "Roundup", cashback: "Cashback", one_time: "One-Time" };
const CAUSE_ICONS = {
  "Hunger & Food Security": "🍽️",
  "Climate & Reforestation": "🌳",
  "Clean Water Access": "💧",
  "Education & Children": "👧",
  "Health & Medical Aid": "🏥",
  "Ocean Conservation": "🌊",
};

function AddDonationModal({ userEmail, onClose }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ cause: CAUSES[0], charity_name: CHARITIES[CAUSES[0]][0], amount: "", donation_type: "one_time", donation_date: new Date().toISOString().slice(0, 10), note: "" });

  const create = useMutation({
    mutationFn: (data) => base44.entities.Donation.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["donations"] }); onClose(); },
  });

  const handleCauseChange = (cause) => setForm(p => ({ ...p, cause, charity_name: CHARITIES[cause][0] }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-7 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-[#1B2B22]" style={{ fontFamily: "'Georgia', serif" }}>Log a Donation</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#EAF0EC] transition-colors"><X className="w-5 h-5 text-[#657066]" /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); create.mutate({ ...form, user_email: userEmail, amount: parseFloat(form.amount) }); }}
          className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-[#657066] uppercase tracking-wider mb-1.5 block">Cause</label>
            <select value={form.cause} onChange={e => handleCauseChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#d4e0d8] text-sm outline-none focus:border-[#3D6B50] bg-white">
              {CAUSES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-[#657066] uppercase tracking-wider mb-1.5 block">Charity</label>
            <select value={form.charity_name} onChange={e => setForm(p => ({ ...p, charity_name: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-[#d4e0d8] text-sm outline-none focus:border-[#3D6B50] bg-white">
              {CHARITIES[form.cause].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#657066] uppercase tracking-wider mb-1.5 block">Amount ($)</label>
              <input type="number" min="0.01" step="0.01" required placeholder="0.00"
                value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-[#d4e0d8] text-sm outline-none focus:border-[#3D6B50]" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#657066] uppercase tracking-wider mb-1.5 block">Type</label>
              <select value={form.donation_type} onChange={e => setForm(p => ({ ...p, donation_type: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-[#d4e0d8] text-sm outline-none focus:border-[#3D6B50] bg-white">
                {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-[#657066] uppercase tracking-wider mb-1.5 block">Date</label>
            <input type="date" required value={form.donation_date} onChange={e => setForm(p => ({ ...p, donation_date: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-[#d4e0d8] text-sm outline-none focus:border-[#3D6B50]" />
          </div>
          <div>
            <label className="text-xs font-bold text-[#657066] uppercase tracking-wider mb-1.5 block">Note (optional)</label>
            <input placeholder="Any note…" value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-[#d4e0d8] text-sm outline-none focus:border-[#3D6B50]" />
          </div>
          <button type="submit" disabled={create.isPending}
            className="mt-1 w-full py-3.5 bg-[#1B2B22] text-white font-bold rounded-full hover:bg-[#3D6B50] transition-colors disabled:opacity-60 text-sm">
            {create.isPending ? "Saving…" : "Log Donation"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function DonationHistory({ donations, userEmail }) {
  const [showModal, setShowModal] = useState(false);

  const sorted = [...donations].sort((a, b) => new Date(b.donation_date) - new Date(a.donation_date));

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <p className="text-sm text-[#657066]">{donations.length} donation{donations.length !== 1 ? "s" : ""} recorded</p>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B2B22] text-white text-xs font-bold rounded-full hover:bg-[#3D6B50] transition-colors">
          <PlusCircle className="w-3.5 h-3.5" /> Log Donation
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-14 text-[#657066]">
          <div className="text-5xl mb-4">💝</div>
          <p className="font-semibold text-[#1B2B22] mb-1">No donations logged yet</p>
          <p className="text-sm">Start logging your giving history to track your impact.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4 bg-white border border-[#d4e0d8] rounded-2xl px-5 py-4 hover:shadow-sm transition-all">
              <div className="text-2xl flex-shrink-0">{CAUSE_ICONS[d.cause] || "💚"}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-[#1B2B22]">{d.charity_name || d.cause}</div>
                <div className="text-xs text-[#657066] mt-0.5">{d.cause} · {TYPE_LABELS[d.donation_type] || d.donation_type}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-[#1B2B22]">${d.amount.toFixed(2)}</div>
                <div className="text-xs text-[#657066]">{new Date(d.donation_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showModal && <AddDonationModal userEmail={userEmail} onClose={() => setShowModal(false)} />}
    </div>
  );
}