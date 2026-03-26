import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, Check } from 'lucide-react';

export default function Tasks() {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    task_type: 'personal',
    status: 'todo',
    priority: 'medium',
    due_date: '',
    assigned_to_email: '',
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: () => base44.entities.TeamMember.list(),
    initialData: [],
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['teamTasks', user?.email],
    queryFn: () => user?.email ? base44.entities.TeamTask.filter({}, '-created_date', 100) : [],
    enabled: !!user?.email,
  });

  const createTaskMutation = useMutation({
    mutationFn: (taskData) => base44.entities.TeamTask.create({
      ...taskData,
      created_by_email: user.email,
      created_by_name: user.full_name,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamTasks'] });
      resetForm();
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.TeamTask.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamTasks'] });
      resetForm();
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id) => base44.entities.TeamTask.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamTasks'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTask) {
      updateTaskMutation.mutate({ id: editingTask.id, data: formData });
    } else {
      createTaskMutation.mutate(formData);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      task_type: task.task_type,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date || '',
      assigned_to_email: task.assigned_to_email || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      task_type: 'personal',
      status: 'todo',
      priority: 'medium',
      due_date: '',
      assigned_to_email: '',
    });
    setEditingTask(null);
    setShowForm(false);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterType === 'my') {
      return task.created_by_email === user?.email || task.assigned_to_email === user?.email;
    }
    if (filterType === 'assigned') {
      return task.assigned_to_email === user?.email;
    }
    return true;
  });

  const groupedTasks = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    in_progress: filteredTasks.filter(t => t.status === 'in_progress'),
    completed: filteredTasks.filter(t => t.status === 'completed'),
  };

  const getPriorityColor = (priority) => {
    const colors = { low: 'bg-blue-500', medium: 'bg-yellow-500', high: 'bg-red-500' };
    return colors[priority] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Tasks</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-rose-500/20"
        >
          <Plus size={18} /> New Task
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-blue-900/30">
        {[
          { key: 'all', label: 'All Tasks' },
          { key: 'my', label: 'My Tasks' },
          { key: 'assigned', label: 'Assigned to Me' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key)}
            className={`px-4 py-2 font-medium transition-all ${
              filterType === tab.key
                ? 'text-pink-400 border-b-2 border-pink-400'
                : 'text-blue-300/60 hover:text-blue-300/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-blue-950 to-indigo-950 rounded-xl border border-blue-900/30 p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Task title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-blue-900/20 border border-blue-800/30 rounded-lg px-4 py-2 text-white placeholder-blue-400/40 focus:outline-none focus:border-pink-500 transition-all"
              required
            />

            <textarea
              placeholder="Description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-blue-900/20 border border-blue-800/30 rounded-lg px-4 py-2 text-white placeholder-blue-400/40 focus:outline-none focus:border-pink-500 transition-all h-24"
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.task_type}
                onChange={(e) => setFormData({ ...formData, task_type: e.target.value })}
                className="bg-blue-900/20 border border-blue-800/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500 transition-all"
              >
                <option value="personal">Personal</option>
                <option value="team">Team Task</option>
              </select>

              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="bg-blue-900/20 border border-blue-800/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500 transition-all"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            {formData.task_type === 'team' && (
              <select
                value={formData.assigned_to_email}
                onChange={(e) => setFormData({ ...formData, assigned_to_email: e.target.value })}
                className="w-full bg-blue-900/20 border border-blue-800/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500 transition-all"
              >
                <option value="">Assign to team member...</option>
                {teamMembers.filter(m => m.email !== user?.email).map(member => (
                  <option key={member.id} value={member.email}>{member.full_name}</option>
                ))}
              </select>
            )}

            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full bg-blue-900/20 border border-blue-800/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500 transition-all"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white py-2 rounded-lg font-medium transition-all shadow-lg shadow-rose-500/20"
              >
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-blue-900/30 hover:bg-blue-900/40 text-white py-2 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Task Columns */}
      <div className="grid grid-cols-3 gap-6">
        {['todo', 'in_progress', 'completed'].map((status) => (
          <div key={status} className="bg-gradient-to-br from-blue-950 to-indigo-950 rounded-xl border border-blue-900/30 p-4 space-y-4">
            <h3 className="font-bold text-white capitalize flex items-center gap-2">
              {status === 'todo' && '📋 To Do'}
              {status === 'in_progress' && '⚙️ In Progress'}
              {status === 'completed' && '✅ Completed'}
              <span className="text-sm text-blue-300/60">{groupedTasks[status].length}</span>
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {groupedTasks[status].map((task) => (
                <div key={task.id} className="bg-blue-900/20 rounded-lg p-3 space-y-2 hover:bg-blue-900/30 transition-colors border border-blue-800/20">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-white text-sm">{task.title}</p>
                      {task.description && <p className="text-xs text-blue-200/60 mt-1">{task.description}</p>}
                    </div>
                    <span className={`${getPriorityColor(task.priority)} text-white text-xs px-2 py-1 rounded`}>
                      {task.priority}
                    </span>
                  </div>

                  {task.assigned_to_name && (
                    <p className="text-xs text-blue-300/60">👤 {task.assigned_to_name}</p>
                  )}

                  {task.due_date && (
                    <p className="text-xs text-blue-300/60">📅 {task.due_date}</p>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-blue-800/20">
                    <button
                      onClick={() => {
                        const newStatus = status === 'todo' ? 'in_progress' : status === 'in_progress' ? 'completed' : 'todo';
                        updateTaskMutation.mutate({ id: task.id, data: { status: newStatus } });
                      }}
                      className="flex-1 text-xs bg-rose-600 hover:bg-rose-700 text-white py-1 rounded flex items-center justify-center gap-1 transition-all shadow-lg shadow-rose-600/30"
                    >
                      <Check size={14} /> Move
                    </button>
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-blue-300/60 hover:text-white transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteTaskMutation.mutate(task.id)}
                      className="text-blue-300/60 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}