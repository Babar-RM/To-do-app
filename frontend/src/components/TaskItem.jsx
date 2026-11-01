import { useState } from "react";
import confetti from "canvas-confetti";
import { 
  FaCheck, 
  FaEdit, 
  FaTrashAlt, 
  FaCalendarAlt, 
  FaChevronDown, 
  FaChevronUp, 
  FaListUl,
  FaFire
} from "react-icons/fa";
import "./TaskItem.css";

const CATEGORY_ICONS = {
  Work: "💼",
  Personal: "👤",
  Study: "📚",
  Health: "🏃",
  Finance: "💰",
  Ideas: "💡",
};

const PRIORITY_CONFIG = {
  urgent: { label: "Urgent", color: "#ef4444", bg: "rgba(239, 68, 68, 0.12)", icon: "🔥" },
  high: { label: "High", color: "#f97316", bg: "rgba(249, 115, 22, 0.12)", icon: "🔴" },
  medium: { label: "Medium", color: "#eab308", bg: "rgba(234, 179, 8, 0.12)", icon: "🟡" },
  low: { label: "Low", color: "#10b981", bg: "rgba(16, 185, 129, 0.12)", icon: "🟢" },
};

export default function TaskItem({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
  onUpdateSubtasks,
}) {
  const [expanded, setExpanded] = useState(false);

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    const willBeCompleted = !todo.completed;
    onToggleComplete(todo);

    if (willBeCompleted) {
      // Trigger festive celebration confetti!
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#6366f1", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"],
        });
      } catch {
        // Fallback silently if canvas not supported
      }
    }
  };

  const handleSubtaskToggle = (subtaskId) => {
    if (!onUpdateSubtasks) return;
    const updated = (todo.subtasks || []).map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    onUpdateSubtasks(todo._id, updated);
  };

  // Due date formatting helper
  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    const due = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDay = new Date(due);
    dueDay.setHours(0, 0, 0, 0);

    const diffDays = Math.round((dueDay - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)}d`, status: "overdue" };
    } else if (diffDays === 0) {
      return { text: "Due Today", status: "today" };
    } else if (diffDays === 1) {
      return { text: "Due Tomorrow", status: "tomorrow" };
    } else if (diffDays < 7) {
      return { text: `Due in ${diffDays}d`, status: "soon" };
    } else {
      return {
        text: due.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        status: "normal",
      };
    }
  };

  const dueInfo = formatDueDate(todo.dueDate);
  const priorityInfo = PRIORITY_CONFIG[todo.priority] || PRIORITY_CONFIG.medium;
  const categoryIcon = CATEGORY_ICONS[todo.category] || "📌";

  const totalSubtasks = todo.subtasks?.length || 0;
  const doneSubtasks = todo.subtasks?.filter((s) => s.completed).length || 0;

  return (
    <div className={`task-card glass-panel ${todo.completed ? "task-is-completed" : ""} animate-fade-in`}>
      <div className="task-card-main">
        {/* Animated Checkbox */}
        <button
          className={`task-checkbox ${todo.completed ? "checked" : ""}`}
          onClick={handleCheckboxClick}
          id={`task-check-${todo._id}`}
          aria-label={todo.completed ? "Mark task as incomplete" : "Mark task as complete"}
        >
          {todo.completed && <FaCheck className="check-svg" />}
        </button>

        {/* Task Content Details */}
        <div className="task-content">
          <div className="task-title-row">
            <span className={`task-title ${todo.completed ? "completed-title" : ""}`}>
              {todo.title}
            </span>
          </div>

          {todo.description && (
            <p className="task-description">{todo.description}</p>
          )}

          {/* Badges and metadata */}
          <div className="task-metadata">
            {/* Category Badge */}
            <span className="meta-badge category-badge">
              <span>{categoryIcon}</span>
              <span>{todo.category || "General"}</span>
            </span>

            {/* Priority Badge */}
            <span
              className="meta-badge priority-badge"
              style={{
                color: priorityInfo.color,
                backgroundColor: priorityInfo.bg,
              }}
            >
              <span>{priorityInfo.icon}</span>
              <span>{priorityInfo.label}</span>
            </span>

            {/* Due Date Badge */}
            {dueInfo && (
              <span className={`meta-badge due-badge due-${dueInfo.status}`}>
                <FaCalendarAlt size={11} />
                <span>{dueInfo.text}</span>
              </span>
            )}

            {/* Subtasks Counter pill */}
            {totalSubtasks > 0 && (
              <button
                type="button"
                className="meta-badge subtasks-pill"
                onClick={() => setExpanded(!expanded)}
                title="Toggle subtasks checklist"
              >
                <FaListUl size={11} />
                <span>
                  {doneSubtasks}/{totalSubtasks} steps
                </span>
                {expanded ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
              </button>
            )}
          </div>
        </div>

        {/* Card Action Buttons */}
        <div className="task-actions">
          <button
            className="action-btn edit-btn"
            onClick={() => onEdit(todo)}
            title="Edit task"
            id={`task-edit-${todo._id}`}
          >
            <FaEdit />
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => onDelete(todo._id)}
            title="Move to trash"
            id={`task-delete-${todo._id}`}
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>

      {/* Expanded Subtasks Checklist Section */}
      {expanded && totalSubtasks > 0 && (
        <div className="task-subtasks-expanded animate-scale-in">
          <div className="subtask-progress-bar">
            <div
              className="subtask-progress-fill"
              style={{
                width: `${(doneSubtasks / totalSubtasks) * 100}%`,
              }}
            ></div>
          </div>
          <div className="expanded-subtasks-list">
            {todo.subtasks.map((st) => (
              <label key={st.id} className="expanded-subtask-item">
                <input
                  type="checkbox"
                  checked={st.completed}
                  onChange={() => handleSubtaskToggle(st.id)}
                  className="expanded-subtask-check"
                />
                <span className={`expanded-subtask-text ${st.completed ? "done" : ""}`}>
                  {st.text}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
