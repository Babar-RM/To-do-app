import { useEffect, useState, useMemo, useCallback } from "react";
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaSortAmountDown, 
  FaTimes, 
  FaSlidersH,
  FaCheckDouble,
  FaInbox,
  FaCalendarCheck,
  FaSpinner
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import ProductivityStats from "../components/ProductivityStats";
import TaskItem from "../components/TaskItem";
import TaskModal from "../components/TaskModal";
import { API } from "../services/api";
import { useToast } from "../context/ToastContext";
import "./Todos.css";

const CATEGORIES = ["All", "Work", "Personal", "Study", "Health", "Finance", "Ideas"];
const STATUS_TABS = [
  { id: "all", label: "All Tasks" },
  { id: "active", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

export default function Todos() {
  const { toast } = useToast();

  const [todos, setTodos] = useState([]);
  const [trashCount, setTrashCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Quick Add input state
  const [quickTitle, setQuickTitle] = useState("");
  const [quickPriority, setQuickPriority] = useState("medium");
  const [quickCategory, setQuickCategory] = useState("Personal");

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/todos");
      setTodos(res.data.data || []);
    } catch (err) {
      console.error("Fetch todos error:", err);
      toast.error(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchTrashCount = useCallback(async () => {
    try {
      const res = await API.get("/todos/trash");
      setTrashCount((res.data.data || []).length);
    } catch (err) {
      console.error("Fetch trash count error:", err);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
    fetchTrashCount();
  }, [fetchTodos, fetchTrashCount]);

  // Quick Add task handler
  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    try {
      const res = await API.post("/todos", {
        title: quickTitle.trim(),
        priority: quickPriority,
        category: quickCategory,
      });

      const newTodo = res.data.data;
      setTodos((prev) => [newTodo, ...prev]);
      setQuickTitle("");
      toast.success("Task created successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    }
  };

  // Modal Save (Create or Edit)
  const handleModalSave = async (taskData) => {
    try {
      if (editingTodo) {
        // Edit existing
        const res = await API.patch(`/todos/${editingTodo._id}`, taskData);
        const updated = res.data.data;
        setTodos((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
        toast.success("Task updated!");
      } else {
        // Create new
        const res = await API.post("/todos", taskData);
        setTodos((prev) => [res.data.data, ...prev]);
        toast.success("Task created!");
      }
      setIsModalOpen(false);
      setEditingTodo(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save task");
    }
  };

  // Toggle completion
  const handleToggleComplete = async (todo) => {
    const updatedStatus = !todo.completed;
    // Optimistic UI update
    setTodos((prev) =>
      prev.map((t) => (t._id === todo._id ? { ...t, completed: updatedStatus } : t))
    );

    try {
      await API.patch(`/todos/${todo._id}`, { completed: updatedStatus });
      if (updatedStatus) {
        toast.success(`Completed "${todo.title}"! 🎉`);
      }
    } catch (err) {
      // Revert if error
      setTodos((prev) =>
        prev.map((t) => (t._id === todo._id ? { ...t, completed: !updatedStatus } : t))
      );
      toast.error("Failed to update status");
    }
  };

  // Move to trash (Soft Delete)
  const handleDelete = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t._id !== id));
      setTrashCount((prev) => prev + 1);
      toast.info("Task moved to trash");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  // Update subtasks inline
  const handleUpdateSubtasks = async (id, updatedSubtasks) => {
    setTodos((prev) =>
      prev.map((t) => (t._id === id ? { ...t, subtasks: updatedSubtasks } : t))
    );

    try {
      await API.patch(`/todos/${id}`, { subtasks: updatedSubtasks });
    } catch (err) {
      console.error("Subtask update failed:", err);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  // Filtered & Sorted Todos
  const filteredTodos = useMemo(() => {
    return todos
      .filter((item) => {
        // Status filter
        if (statusFilter === "active" && item.completed) return false;
        if (statusFilter === "completed" && !item.completed) return false;

        // Category filter
        if (categoryFilter !== "All" && item.category !== categoryFilter) return false;

        // Priority filter
        if (priorityFilter !== "All" && item.priority !== priorityFilter.toLowerCase()) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title?.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortBy === "oldest") {
          return new Date(a.createdAt) - new Date(b.createdAt);
        } else if (sortBy === "dueDate") {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (sortBy === "priority") {
          const map = { urgent: 0, high: 1, medium: 2, low: 3 };
          return (map[a.priority] ?? 2) - (map[b.priority] ?? 2);
        } else if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [todos, statusFilter, categoryFilter, priorityFilter, searchQuery, sortBy]);

  return (
    <div className="todos-page-container">
      {/* Ambient Animated Glow Blobs */}
      <div className="ambient-bg">
        <div className="ambient-blob-1"></div>
        <div className="ambient-blob-2"></div>
        <div className="ambient-blob-3"></div>
      </div>

      <Navbar trashCount={trashCount} />

      <main className="todos-main-content">
        {/* Productivity Analytics Card */}
        <ProductivityStats todos={todos} />

        {/* Quick Add Bar & New Task Modal Button */}
        <section className="creation-section glass-panel">
          <form onSubmit={handleQuickAdd} className="quick-add-form">
            <div className="quick-add-input-wrap">
              <input
                type="text"
                className="quick-add-input"
                placeholder="Type a task and hit Enter to quickly add..."
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                id="quick-add-input"
              />
              {quickTitle && (
                <button
                  type="button"
                  className="quick-clear-btn"
                  onClick={() => setQuickTitle("")}
                  aria-label="Clear input"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            <div className="quick-add-controls">
              {/* Priority Select */}
              <select
                className="quick-select"
                value={quickPriority}
                onChange={(e) => setQuickPriority(e.target.value)}
                id="quick-priority-select"
              >
                <option value="urgent">🔥 Urgent</option>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>

              {/* Category Select */}
              <select
                className="quick-select"
                value={quickCategory}
                onChange={(e) => setQuickCategory(e.target.value)}
                id="quick-category-select"
              >
                {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="btn-quick-add"
                id="quick-add-submit-btn"
                disabled={!quickTitle.trim()}
              >
                <FaPlus /> Add
              </button>

              <button
                type="button"
                className="btn-full-task-modal"
                onClick={() => {
                  setEditingTodo(null);
                  setIsModalOpen(true);
                }}
                id="open-create-modal-btn"
                title="Create task with full details & subtasks"
              >
                <FaSlidersH /> Detailed Task
              </button>
            </div>
          </form>
        </section>

        {/* Filtering & Search Toolbar */}
        <section className="toolbar-section glass-panel">
          <div className="toolbar-top">
            {/* Search Input */}
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search tasks by title or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="search-tasks-input"
              />
              {searchQuery && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Status Tabs */}
            <div className="status-tabs">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`status-tab ${statusFilter === tab.id ? "active" : ""}`}
                  onClick={() => setStatusFilter(tab.id)}
                  id={`status-tab-${tab.id}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="toolbar-bottom">
            {/* Category Pills */}
            <div className="category-pills">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`category-pill ${categoryFilter === cat ? "active" : ""}`}
                  onClick={() => setCategoryFilter(cat)}
                  id={`filter-cat-${cat.toLowerCase()}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Dropdowns for Priority & Sort */}
            <div className="toolbar-dropdowns">
              <div className="filter-dropdown-wrap">
                <FaFilter className="dropdown-prefix-icon" />
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="toolbar-select"
                  id="filter-priority-select"
                >
                  <option value="All">All Priorities</option>
                  <option value="Urgent">🔥 Urgent</option>
                  <option value="High">🔴 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>
              </div>

              <div className="filter-dropdown-wrap">
                <FaSortAmountDown className="dropdown-prefix-icon" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="toolbar-select"
                  id="sort-by-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Tasks List Area */}
        <section className="tasks-display-section" id="tasks-display-section">
          {loading ? (
            <div className="loading-state">
              <FaSpinner className="spinner-icon" />
              <p>Loading your tasks...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="empty-state glass-panel animate-scale-in">
              {todos.length === 0 ? (
                <>
                  <div className="empty-icon-wrap">
                    <FaInbox size={42} />
                  </div>
                  <h3>Your task list is empty</h3>
                  <p>Start your day with purpose! Add your first goal above.</p>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setEditingTodo(null);
                      setIsModalOpen(true);
                    }}
                    id="empty-create-btn"
                  >
                    <FaPlus /> Create Your First Task
                  </button>
                </>
              ) : (
                <>
                  <div className="empty-icon-wrap">
                    <FaCalendarCheck size={42} />
                  </div>
                  <h3>No matching tasks found</h3>
                  <p>Try clearing your search query or adjusting your filters.</p>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setCategoryFilter("All");
                      setPriorityFilter("All");
                    }}
                    id="clear-filters-btn"
                  >
                    Reset Filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="tasks-list">
              {filteredTodos.map((todo) => (
                <TaskItem
                  key={todo._id}
                  todo={todo}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                  onUpdateSubtasks={handleUpdateSubtasks}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Task Creation / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTodo(null);
        }}
        onSave={handleModalSave}
        initialTask={editingTodo}
      />
    </div>
  );
}