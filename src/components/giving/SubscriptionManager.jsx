import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Pause, Play, Trash2, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SubscriptionCalendar from "./SubscriptionCalendar";

const CAUSES = ["Hunger & Food Security", "Climate & Reforestation", "Clean Water Access", "Education & Children", "Health & Medical Aid", "Ocean Conservation"];
const CHARITIES = {
  "Hunger & Food Security":  ["Feeding America", "World Food Programme"],
  "Climate & Reforestation": ["One Tree Planted", "Arbor Day Foundation"],
  "Clean Water Access":      ["Water.org", "charity: water"],
  "Education & Children":    ["Save the Children", "Room to Read"],
  "Health & Medical Aid":    ["Partners in Health", "UNICEF"],
  "Ocean Conservation":      ["Ocean Conservancy", "Surfrider Foundation"],
};
const CAUSE_ICONS = {
  "Hunger & Food Security": "🍽️",
  "Climate & Reforestation": "🌳",
  "Clean Water Access": "💧",
  "Education & Children": "👧",
  "Health & Medical Aid": "🏥",
  "Ocean Conservation": "🌊",
};

const today = () => new Date().toISOString().slice(0, 10);

function computeNextDate(billingDay) {
  const now = new Date();
  const day = Math.min(billingDay, 28);
  let next = new Date(now.getFullYear(), now.getMonth(), day);
  if (next <= now) next = new Date(now.getFullYear(), now.getMonth() + 1, day);
  return next.toISOString().slice(0, 10);
}

function SubForm({ initial, userEmail, onClose }) {
  const qc = useQueryClient();
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({
    cause: initial?.cause || CAUSES[0],
    charity_name: initial?.charity_name || CHARITIES[CAUSES[0]][0],
    amount: initial?.amount || "",
    billing_day: initial?.billing_day || 1,
    note: initial?.note || "",
  });

  const upsert = useMutation({
    mutationFn: (data) => isEdit
      ? base44.entities.Subscription.update(initial.id, data)
      : base44.entities.Subscription.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["subscriptions"] }); onClose(); },
  });

  const handleCauseChange = (cause) => setForm(p => ({ ...p, cause, charity_name: CHARITIES[cause][0] }));

  const handleSubmit = (e) => {
    e.preventDefault();
    upsert.mutate({
      ...form,
      user_email: userEmail,
      amount: parseFloat(form.amount),
      billing_day: parseInt(form.billing_day),
      next_donation_date: computeNextDate(parseInt(form.billing_day)),
      started_date: initial?.started_date || today(),
      status: initial?.status || "active",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-7 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-[#1B2B22]" style={{ fontFamily: "'Georgia', serif" }}>
            {isEdit ? "Edit Subscription" : "New Monthly Subscription"}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#EAF0EC] transition-colors"><X className="w-5 h-5 text-[#657066]" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              <label className="text-xs font-bold text-[#657066] uppercase tracking-wider mb-1.5 block">Monthly Amount ($)</label>
              <input type="number" min="1" step="0.01" required placeholder="0.00"
                value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-[#d4e0d8] text-sm outline-none focus:border-[#3D6B50]" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#657066] uppercase tracking-wider mb-1.5 block">Billing Day</label>
              <input type="number" min="1" max="28" required
                value={form.billing_day} onChange={e => setForm(p => ({ ...p, billing_day: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-[#d4e0d8] text-sm outline-none focus:border-[#3D6B50]" />
              <p className="text-[10px] text-[#657066] mt-1">Day 1–28 of each month</p>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-[#657066] uppercase tracking-wider mb-1.5 block">Note (optional)</label>
            <input placeholder="E.g. Birthday giving…" value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-[#d4e0d8] text-sm outline-none focus:border-[#3D6B50]" />
          </div>
          <button type="submit" disabled={upsert.isPending}
            className="mt-1 w-full py-3.5 bg-[#1B2B22] text-white font-bold rounded-full hover:bg-[#3D6B50] transition-colors disabled:opacity-60 text-sm">
            {upsert.isPending ? "Saving…" : isEdit ? "Save Changes" : "Start Subscription"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

const STATUS_BADGE = {
  active:    "bg-[#EAF0EC] text-[#3D6B50]",
  paused:    "bg-[#FEF9EC] text-[#D4A84B]",
  cancelled: "bg-red-50 text-red-500",
};

export default function SubscriptionManager({ subscriptions, userEmail }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const qc = useQueryClient();

  const toggleStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Subscription.update(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscriptions"] }),
  });

  const cancel = useMutation({
    mutationFn: (id) => base44.entities.Subscription.update(id, { status: "cancelled" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscriptions"] }),
  });

  const active = subscriptions.filter(s => s.status !== "cancelled");
  const monthlyTotal = subscriptions.filter(s => s.status === "active").reduce((a, s) => a + s.amount, 0);

  return (
    <div>
      {/* Summary bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#1B2B22] rounded-2xl px-6 py-5">
        <div>
          <div className="text-[#D4A84B] text-2xl font-bold" style={{ fontFamily: "'Georgia', serif" }}>${monthlyTotal.toFixed(2)}<span className="text-sm font-normal text-white/50">/mo</span></div>
          <div className="text-white/60 text-xs mt-0.5">{subscriptions.filter(s => s.status === "active").length} active subscription{subscriptions.filter(s => s.status === "active").length !== 1 ? "s" : ""}</div>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-white text-[#1B2B22] font-bold px-5 py-2.5 rounded-full text-sm hover:bg-[#EAF0EC] transition-colors">
          <Plus className="w-4 h-4" /> Add Subscription
        </button>
      </div>

      {/* Subscription cards */}
      {active.length === 0 ? (
        <div className="text-center py-14 text-[#657066]">
          <div className="text-5xl mb-4">🔄</div>
          <p className="font-semibold text-[#1B2B22] mb-1">No active subscriptions</p>
          <p className="text-sm">Set up a recurring monthly donation to get started.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <AnimatePresence>
            {active.map((sub, i) => (
              <motion.div key={sub.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.05 }}
                className={`bg-white border rounded-2xl p-5 transition-all ${sub.status === "paused" ? "border-[#D4A84B]/40 opacity-80" : "border-[#d4e0d8]"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{CAUSE_ICONS[sub.cause]}</span>
                    <div>
                      <div className="font-bold text-sm text-[#1B2B22]">{sub.charity_name || sub.cause}</div>
                      <div className="text-xs text-[#657066]">{sub.cause}</div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[sub.status]}`}>{sub.status}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-[#1B2B22]" style={{ fontFamily: "'Georgia', serif" }}>${sub.amount}</span>
                    <span className="text-xs text-[#657066]">/month · day {sub.billing_day}</span>
                  </div>
                  {sub.next_donation_date && sub.status === "active" && (
                    <div className="text-right">
                      <div className="text-xs text-[#657066]">Next charge</div>
                      <div className="text-xs font-bold text-[#3D6B50]">{new Date(sub.next_donation_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                    </div>
                  )}
                </div>

                {sub.note && <p className="text-xs text-[#657066] italic mb-3 truncate">"{sub.note}"</p>}

                <div className="flex items-center gap-2 border-t border-[#EAF0EC] pt-3">
                  <button onClick={() => { setEditing(sub); setShowForm(true); }}
                    className="flex items-center gap-1 text-xs text-[#657066] hover:text-[#1B2B22] font-semibold transition-colors px-2 py-1 rounded-lg hover:bg-[#EAF0EC]">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => toggleStatus.mutate({ id: sub.id, status: sub.status === "active" ? "paused" : "active" })}
                    className="flex items-center gap-1 text-xs text-[#657066] hover:text-[#D4A84B] font-semibold transition-colors px-2 py-1 rounded-lg hover:bg-[#FEF9EC]">
                    {sub.status === "active" ? <><Pause className="w-3.5 h-3.5" /> Pause</> : <><Play className="w-3.5 h-3.5" /> Resume</>}
                  </button>
                  <button onClick={() => { if (confirm("Cancel this subscription?")) cancel.mutate(sub.id); }}
                    className="flex items-center gap-1 text-xs text-[#657066] hover:text-red-500 font-semibold transition-colors px-2 py-1 rounded-lg hover:bg-red-50 ml-auto">
                    <Trash2 className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Calendar view */}
      <div className="bg-[#FDFAF5] border border-[#d4e0d8] rounded-2xl p-6">
        <h3 className="font-bold text-lg text-[#1B2B22] mb-6" style={{ fontFamily: "'Georgia', serif" }}>Donation Cycle Calendar</h3>
        <SubscriptionCalendar subscriptions={subscriptions} />
      </div>

      {showForm && <SubForm initial={editing} userEmail={userEmail} onClose={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}