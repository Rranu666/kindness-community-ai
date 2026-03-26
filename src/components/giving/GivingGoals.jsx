import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CAUSES = ["Any Cause", "Hunger & Food Security", "Climate & Reforestation", "Clean Water Access", "Education & Children", "Health & Medical Aid", "Ocean Conservation"];

function AddGoalForm({ userEmail, onClose }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: "", cause: "Any Cause", target_amount: "", deadline: "" });

  const create = useMutation({
    mutationFn: (data) => base44.entities.GivingGoal.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["givingGoals"] }); onClose(); },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.target_amount) return;
    create.mutate({ ...form, user_email: userEmail, target_amount: parseFloat(form.target_amount), current_amount: 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#EAF0EC] rounded-2xl p-5 border border-[#3D6B50]/20 flex flex-col gap-3">
      <input
        className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d8] bg-white text-sm outline-none focus:border-[#3D6B50]"
        placeholder="Goal title (e.g. Plant 50 trees this year)"
        value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required
      />
      <div className="grid grid-cols-2 gap-3">
        <select
          className="px-4 py-2.5 rounded-xl border border-[#d4e0d8] bg-white text-sm outline-none focus:border-[#3D6B50]"
          value={form.cause} onChange={e => setForm(p => ({ ...p, cause: e.target.value }))}
        >
          {CAUSES.map(c => <option key={c}>{c}</option>)}
        </select>
        <input
          type="number" min="1" step="0.01"
          className="px-4 py-2.5 rounded-xl border border-[#d4e0d8] bg-white text-sm outline-none focus:border-[#3D6B50]"
          placeholder="Target $ amount"
          value={form.target_amount} onChange={e => setForm(p => ({ ...p, target_amount: e.target.value }))} required
        />
      </div>
      <input
        type="date"
        className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d8] bg-white text-sm outline-none focus:border-[#3D6B50]"
        value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
      />
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-[#657066] hover:text-[#1B2B22] transition-colors">Cancel</button>
        <button type="submit" disabled={create.isPending} className="px-5 py-2 text-sm font-bold bg-[#1B2B22] text-white rounded-full hover:bg-[#3D6B50] transition-colors disabled:opacity-60">
          {create.isPending ? "Saving…" : "Add Goal"}
        </button>
      </div>
    </form>
  );
}

export default function GivingGoals({ goals, donations, userEmail }) {
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();

  const deleteGoal = useMutation({
    mutationFn: (id) => base44.entities.GivingGoal.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["givingGoals"] }),
  });

  const toggleComplete = useMutation({
    mutationFn: ({ id, is_completed }) => base44.entities.GivingGoal.update(id, { is_completed }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["givingGoals"] }),
  });

  // compute donated per cause for auto-progress
  const donatedByCause = {};
  donations.forEach(d => {
    donatedByCause[d.cause] = (donatedByCause[d.cause] || 0) + d.amount;
  });
  const totalDonated = donations.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="flex flex-col gap-4">
      {goals.map((goal, i) => {
        const donated = goal.cause === "Any Cause" ? totalDonated : (donatedByCause[goal.cause] || 0);
        const pct = Math.min(100, Math.round((donated / goal.target_amount) * 100));
        const isComplete = goal.is_completed || pct >= 100;

        return (
          <motion.div key={goal.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`bg-white rounded-2xl p-5 border transition-all ${isComplete ? "border-[#5C9470]/50 bg-[#EAF0EC]/40" : "border-[#d4e0d8]"}`}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {isComplete && <CheckCircle2 className="w-4 h-4 text-[#5C9470] flex-shrink-0" />}
                  <span className={`font-bold text-sm ${isComplete ? "text-[#3D6B50]" : "text-[#1B2B22]"}`}>{goal.title}</span>
                </div>
                <div className="text-xs text-[#657066] mt-0.5">{goal.cause}{goal.deadline ? ` · Due ${new Date(goal.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : ""}</div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleComplete.mutate({ id: goal.id, is_completed: !goal.is_completed })}
                  className="p-1.5 rounded-lg hover:bg-[#EAF0EC] text-[#3D6B50] transition-colors" title={isComplete ? "Mark incomplete" : "Mark complete"}>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <button onClick={() => deleteGoal.mutate(goal.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-[#657066] hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-[#3D6B50]">${donated.toFixed(0)} raised</span>
              <span className="text-[#657066]">${goal.target_amount.toFixed(0)} goal · {pct}%</span>
            </div>
            <div className="h-2 bg-[#EAF0EC] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: isComplete ? "linear-gradient(to right,#5C9470,#1B2B22)" : "linear-gradient(to right,#D4A84B,#5C9470)" }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        );
      })}

      {showForm ? (
        <AddGoalForm userEmail={userEmail} onClose={() => setShowForm(false)} />
      ) : (
        <button onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-dashed border-[#3D6B50]/30 rounded-2xl text-[#3D6B50] text-sm font-semibold hover:border-[#3D6B50]/60 hover:bg-[#EAF0EC]/40 transition-all">
          <Plus className="w-4 h-4" /> Add a Giving Goal
        </button>
      )}
    </div>
  );
}