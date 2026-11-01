import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaTrashAlt, 
  FaUndo, 
  FaArrowLeft, 
  FaTrashRestore, 
  FaExclamationTriangle,
  FaSpinner,
  FaCalendarTimes
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { API } from "../services/api";
import { useToast } from "../context/ToastContext";
import "./Trash.css";

export default function Trash() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [trashTodos, setTrashTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmEmptyModal, setConfirmEmptyModal] = useState(false);

  const fetchTrash = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/todos/trash");
      setTrashTodos(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load trash");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTrash();
  }, [fetchTrash]);

  // Restore single todo
  const handleRestore = async (id, title) => {
    try {
      await API.patch(`/todos/restore/${id}`);
      setTrashTodos((prev) => prev.filter((t) => t._id !== id));
      toast.success(`Restored "${title || "task"}"!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to restore task");
    }
  };

  // Restore all todos
  const handleRestoreAll = async () => {
    try {
      await API.patch("/todos/restore-all");
      setTrashTodos([]);
      toast.success("All tasks restored to your list!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to restore tasks");
    }
  };

  // Permanently delete single todo
  const handlePermanentDelete = async (id) => {
    try {
      await API.delete(`/todos/permanent/${id}`);
      setTrashTodos((prev) => prev.filter((t) => t._id !== id));
      toast.info("Task permanently removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  // Empty trash permanently
  const handleEmptyTrash = async () => {
    try {
      await API.delete("/todos/empty-trash");
      setTrashTodos([]);
      setConfirmEmptyModal(false);
      toast.success("Trash emptied completely");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to empty trash");
    }
  };

  return (
    <div className="trash-page-container">
      {/* Ambient background */}
      <div className="ambient-bg">
        <div className="ambient-blob-1"></div>
        <div className="ambient-blob-2"></div>
      </div>

      <Navbar trashCount={trashTodos.length} />

      <main className="trash-main-content">
        {/* Header Bar */}
        <div className="trash-header-bar glass-panel animate-scale-in">
          <div className="trash-header-left">
            <button
              className="btn-back-link"
              onClick={() => navigate("/todos")}
              id="trash-back-btn"
            >
              <FaArrowLeft /> Back to Tasks
            </button>
            <div className="trash-title-group">
              <h2>Trash Bin</h2>
              <span className="trash-count-pill">{trashTodos.length} items</span>
            </div>
          </div>

          {trashTodos.length > 0 && (
            <div className="trash-bulk-actions">
              <button
                className="btn-restore-all"
                onClick={handleRestoreAll}
                id="trash-restore-all-btn"
              >
                <FaTrashRestore /> Restore All
              </button>
              <button
                className="btn-empty-trash"
                onClick={() => setConfirmEmptyModal(true)}
                id="trash-empty-btn"
              >
                <FaTrashAlt /> Empty Trash
              </button>
            </div>
          )}
        </div>

        {/* Trash Items List */}
        <div className="trash-list-section">
          {loading ? (
            <div className="loading-state">
              <FaSpinner className="spinner-icon" />
              <p>Loading trash bin...</p>
            </div>
          ) : trashTodos.length === 0 ? (
            <div className="empty-trash-card glass-panel animate-scale-in">
              <div className="empty-trash-icon-wrap">
                <FaCalendarTimes size={44} />
              </div>
              <h3>Trash is completely empty</h3>
              <p>Items moved to trash will appear here and are automatically cleaned after 30 days.</p>
              <button
                className="btn-primary"
                onClick={() => navigate("/todos")}
                id="empty-trash-back-btn"
              >
                <FaArrowLeft /> Return to Tasks
              </button>
            </div>
          ) : (
            <div className="trash-cards-list">
              {trashTodos.map((todo) => {
                const deletedDate = todo.deletedAt ? new Date(todo.deletedAt).toLocaleDateString() : "";
                return (
                  <div key={todo._id} className="trash-card glass-panel animate-fade-in">
                    <div className="trash-card-info">
                      <span className="trash-card-title">{todo.title}</span>
                      {todo.description && (
                        <p className="trash-card-desc">{todo.description}</p>
                      )}
                      <div className="trash-card-meta">
                        <span className="trash-category-pill">{todo.category || "General"}</span>
                        {deletedDate && (
                          <span className="deleted-date-pill">Deleted: {deletedDate}</span>
                        )}
                      </div>
                    </div>

                    <div className="trash-card-actions">
                      <button
                        className="btn-restore-single"
                        onClick={() => handleRestore(todo._id, todo.title)}
                        title="Restore task to active list"
                        id={`restore-item-${todo._id}`}
                      >
                        <FaUndo /> Restore
                      </button>
                      <button
                        className="btn-delete-forever"
                        onClick={() => handlePermanentDelete(todo._id)}
                        title="Delete permanently"
                        id={`perm-delete-item-${todo._id}`}
                      >
                        <FaTrashAlt /> Delete Forever
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Modal for Empty Trash */}
      {confirmEmptyModal && (
        <div className="modal-backdrop" onClick={() => setConfirmEmptyModal(false)}>
          <div
            className="modal-container glass-panel animate-scale-in confirm-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-icon-wrap">
              <FaExclamationTriangle size={32} />
            </div>
            <h3>Empty Trash Bin?</h3>
            <p>
              This will permanently delete all {trashTodos.length} items in the trash.
              This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button
                className="btn-secondary"
                onClick={() => setConfirmEmptyModal(false)}
                id="cancel-empty-trash-btn"
              >
                Cancel
              </button>
              <button
                className="btn-danger-confirm"
                onClick={handleEmptyTrash}
                id="confirm-empty-trash-btn"
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}