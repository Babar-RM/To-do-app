import { useState, useEffect } from "react";
import { 
  FaTimes, 
  FaPlus, 
  FaTrash, 
  FaCheck, 
  FaCalendarAlt, 
  FaTag, 
  FaFire, 
  FaAlignLeft 
} from "react-icons/fa";
import "./TaskModal.css";

const CATEGORIES = [
  { id: "Work", label: "Work", icon: "💼" },
  { id: "Personal", label: "Personal", icon: "👤" },
  { id: "Study", label: "Study", icon: "📚" },
  { id: "Health", label: "Health", icon: "🏃" },
  { id: "Finance", label: "Finance", icon: "💰" },
  { id: "Ideas", label: "Ideas", icon: "💡" },
];

const PRIORITIES = [
  { id: "urgent", label: "Urgent", color: "#ef4444", icon: "🔥" },
  { id: "high", label: "High", color: "#f97316", icon: "🔴" },
  { id: "medium", label: "Medium", color: "#eab308", icon: "🟡" },
  { id: "low", label: "Low", color: "#10b981", icon: "🟢" },
];

export default function TaskModal({ isOpen, onClose, onSave, initialTask = null }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("Personal");
  const [dueDate, setDueDate] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskText, setNewSubtaskText] = useState("");

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || "");
      setDescription(initialTask.description || "");
      setPriority(initialTask.priority || "medium");
      setCategory(initialTask.category || "Personal");
      setDueDate(initialTask.dueDate ? initialTask.dueDate.substring(0, 10) : "");
      setSubtasks(initialTask.subtasks || []);
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setCategory("Personal");
      setDueDate("");
      setSubtasks([]);
    }
    setNewSubtaskText("");
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = (e) => {
    e?.preventDefault();
    if (!newSubtaskText.trim()) return;
    const item = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      text: newSubtaskText.trim(),
      completed: false,
    };
    setSubtasks([...subtasks, item]);
    setNewSubtaskText("");
  };

  const handleToggleSubtask = (id) => {
    setSubtasks(subtasks.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st)));
  };

  const handleDeleteSubtask = (id) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      subtasks,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-container glass-panel animate-scale-in" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h2>{initialTask ? "Edit Task Details" : "Create New Task"}</h2>
            <p className="modal-subtitle">Organize and structure your productivity goal</p>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close dialog"
            id="modal-close-btn"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Title Input */}
          <div className="form-group">
            <label htmlFor="task-title-input" className="form-label">
              Task Title <span className="required-star">*</span>
            </label>
            <input
              id="task-title-input"
              type="text"
              className="form-input text-lg-input"
              placeholder="What needs to be accomplished?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          {/* Priority & Category Grid */}
          <div className="form-row">
            {/* Priority Selector */}
            <div className="form-group flex-1">
              <label className="form-label">
                <FaFire className="field-icon text-warning" /> Priority Level
              </label>
              <div className="priority-options">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`priority-chip ${priority === p.id ? "active" : ""}`}
                    style={{
                      "--chip-color": p.color,
                    }}
                    onClick={() => setPriority(p.id)}
                    id={`priority-btn-${p.id}`}
                  >
                    <span>{p.icon}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selector */}
            <div className="form-group flex-1">
              <label className="form-label">
                <FaTag className="field-icon text-primary" /> Category
              </label>
              <div className="category-select-wrapper">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select"
                  id="category-select"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Due Date & Time */}
          <div className="form-group">
            <label htmlFor="task-due-date" className="form-label">
              <FaCalendarAlt className="field-icon text-info" /> Due Date
            </label>
            <input
              id="task-due-date"
              type="date"
              className="form-input date-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="task-desc-input" className="form-label">
              <FaAlignLeft className="field-icon" /> Notes & Description
            </label>
            <textarea
              id="task-desc-input"
              className="form-textarea"
              placeholder="Add extra context, links, or notes..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Subtasks Checklist */}
          <div className="form-group subtasks-group">
            <label className="form-label">
              Checklist / Subtasks ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
            </label>
            
            <div className="subtask-input-bar">
              <input
                type="text"
                className="form-input"
                placeholder="Add a step or subtask..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                id="subtask-new-input"
              />
              <button
                type="button"
                className="btn-add-subtask"
                onClick={handleAddSubtask}
                id="subtask-add-btn"
              >
                <FaPlus /> Add
              </button>
            </div>

            {subtasks.length > 0 && (
              <div className="subtask-list">
                {subtasks.map((st) => (
                  <div key={st.id} className="subtask-item">
                    <button
                      type="button"
                      className={`subtask-check ${st.completed ? "completed" : ""}`}
                      onClick={() => handleToggleSubtask(st.id)}
                      aria-label="Toggle subtask"
                    >
                      {st.completed && <FaCheck size={11} />}
                    </button>
                    <span className={`subtask-text ${st.completed ? "done" : ""}`}>
                      {st.text}
                    </span>
                    <button
                      type="button"
                      className="subtask-del"
                      onClick={() => handleDeleteSubtask(st.id)}
                      aria-label="Delete subtask"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              id="modal-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              id="modal-save-btn"
              disabled={!title.trim()}
            >
              {initialTask ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
