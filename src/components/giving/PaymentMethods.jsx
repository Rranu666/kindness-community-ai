import { useState } from "react";
import { CreditCard, Plus, Trash2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SAVED_METHODS_KEY = "kcf_payment_methods";

function loadMethods() {
  try { return JSON.parse(localStorage.getItem(SAVED_METHODS_KEY)) || []; }
  catch { return []; }
}

function saveMethods(methods) {
  localStorage.setItem(SAVED_METHODS_KEY, JSON.stringify(methods));
}

export default function PaymentMethods() {
  const [methods, setMethods] = useState(loadMethods);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "", last4: "", expiry: "", type: "Visa" });
  const [success, setSuccess] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.label || !form.last4 || !form.expiry) return;
    const updated = [...methods, { ...form, id: Date.now() }];
    setMethods(updated);
    saveMethods(updated);
    setForm({ label: "", last4: "", expiry: "", type: "Visa" });
    setShowForm(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  const handleRemove = (id) => {
    const updated = methods.filter(m => m.id !== id);
    setMethods(updated);
    saveMethods(updated);
  };

  const cardIcons = { Visa: "💳", Mastercard: "💳", Amex: "💳", PayPal: "🅿️", Bank: "🏦" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-bold text-xl text-[#1B2B22]" style={{ fontFamily: "'Georgia', serif" }}>Payment Methods</h2>
          <p className="text-[#657066] text-sm mt-1">Manage how you fund your giving plans and one-time donations.</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B2B22] text-white text-sm font-semibold rounded-xl hover:bg-[#2C3E27] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Method
        </button>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-[#EAF4EF] border border-[#3D6B50]/30 text-[#3D6B50] text-sm font-semibold px-4 py-3 rounded-xl mb-5">
            <CheckCircle className="w-4 h-4" /> Payment method saved.
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="bg-[#FDFAF5] border border-[#d4e0d8] rounded-2xl p-6 mb-6 overflow-hidden"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#657066] uppercase tracking-wider block mb-1.5">Card Nickname</label>
                <input className="w-full border border-[#d4e0d8] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3D6B50]/30"
                  placeholder="e.g. Personal Visa" value={form.label}
                  onChange={e => setForm(f => ({ ...f, label: e.target.value }))} required />
              </div>
              <div>
                <label className="text-xs font-bold text-[#657066] uppercase tracking-wider block mb-1.5">Card Type</label>
                <select className="w-full border border-[#d4e0d8] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none"
                  value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  {Object.keys(cardIcons).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#657066] uppercase tracking-wider block mb-1.5">Last 4 Digits</label>
                <input className="w-full border border-[#d4e0d8] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3D6B50]/30"
                  placeholder="e.g. 4242" maxLength={4} value={form.last4}
                  onChange={e => setForm(f => ({ ...f, last4: e.target.value.replace(/\D/, "") }))} required />
              </div>
              <div>
                <label className="text-xs font-bold text-[#657066] uppercase tracking-wider block mb-1.5">Expiry</label>
                <input className="w-full border border-[#d4e0d8] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3D6B50]/30"
                  placeholder="MM/YY" value={form.expiry}
                  onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))} required />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button type="submit" className="px-5 py-2.5 bg-[#3D6B50] text-white text-sm font-semibold rounded-xl hover:bg-[#2C5940] transition-colors">Save Method</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-[#d4e0d8] text-[#657066] text-sm font-semibold rounded-xl hover:bg-[#EAF0EC] transition-colors">Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {methods.length === 0 ? (
        <div className="text-center py-16 bg-[#FDFAF5] rounded-2xl border border-dashed border-[#d4e0d8]">
          <CreditCard className="w-10 h-10 text-[#d4e0d8] mx-auto mb-3" />
          <p className="text-sm text-[#657066]">No payment methods saved yet.</p>
          <p className="text-xs text-[#A0ACA1] mt-1">Add a card or bank account to streamline your giving.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {methods.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between bg-[#FDFAF5] border border-[#d4e0d8] rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cardIcons[m.type] || "💳"}</span>
                <div>
                  <div className="text-sm font-semibold text-[#1B2B22]">{m.label}</div>
                  <div className="text-xs text-[#657066]">{m.type} •••• {m.last4} · Exp {m.expiry}</div>
                </div>
              </div>
              <button onClick={() => handleRemove(m.id)} className="p-2 rounded-xl hover:bg-red-50 text-[#d4e0d8] hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <p className="text-xs text-[#A0ACA1] mt-5">
        🔒 Card details are stored locally on your device. KCF does not process payments directly — you'll be guided to secure checkout when confirming a giving plan.
      </p>
    </div>
  );
}