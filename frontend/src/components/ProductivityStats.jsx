import { 
  FaCheckCircle, 
  FaHourglassHalf, 
  FaExclamationTriangle, 
  FaChartLine 
} from "react-icons/fa";
import "./ProductivityStats.css";

export default function ProductivityStats({ todos = [] }) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const overdue = todos.filter((t) => {
    if (t.completed || !t.dueDate) return false;
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < now;
  }).length;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Dynamic encouraging message
  let motivationalMessage = "Add your first task to get started!";
  if (total > 0) {
    if (percentage === 100) {
      motivationalMessage = "All caught up! You are unstoppable today! 🎉";
    } else if (percentage >= 70) {
      motivationalMessage = "Almost there! Finish strong! 🚀";
    } else if (percentage >= 40) {
      motivationalMessage = "Great momentum! Keep crushing it! 💪";
    } else {
      motivationalMessage = "Small steps make big progress today! ✨";
    }
  }

  return (
    <div className="stats-dashboard glass-panel animate-scale-in">
      <div className="stats-left">
        <div className="stats-header">
          <div className="stats-title-row">
            <FaChartLine className="stats-main-icon" />
            <span className="stats-title">Productivity Overview</span>
          </div>
          <span className="stats-motivation">{motivationalMessage}</span>
        </div>

        {/* Progress bar */}
        <div className="stats-progress-wrapper">
          <div className="progress-label-row">
            <span>Overall Completion</span>
            <span className="progress-percent-text">{percentage}%</span>
          </div>
          <div className="stats-progress-track">
            <div
              className="stats-progress-fill"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Counter chips */}
      <div className="stats-counters">
        <div className="stat-card">
          <div className="stat-icon-wrap stat-total">
            <FaHourglassHalf />
          </div>
          <div className="stat-info">
            <span className="stat-num">{active}</span>
            <span className="stat-label">Active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-completed">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <span className="stat-num">{completed}</span>
            <span className="stat-label">Done</span>
          </div>
        </div>

        {overdue > 0 && (
          <div className="stat-card stat-overdue-card">
            <div className="stat-icon-wrap stat-overdue">
              <FaExclamationTriangle />
            </div>
            <div className="stat-info">
              <span className="stat-num">{overdue}</span>
              <span className="stat-label">Overdue</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
