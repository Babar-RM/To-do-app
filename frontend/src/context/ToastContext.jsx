import { createContext, useContext, useState, useCallback } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

const defaultToast = {
  toast: {
    success: () => {},
    error: () => {},
    info: () => {},
  },
};

const ToastContext = createContext(defaultToast);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type, message, title = "") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, title }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const toast = {
    success: (message, title = "Success") => addToast("success", message, title),
    error: (message, title = "Error") => addToast("error", message, title),
    info: (message, title = "Notice") => addToast("info", message, title),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-container" id="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type} animate-scale-in`}>
            <div className="toast-icon">
              {t.type === "success" && <FaCheckCircle size={20} />}
              {t.type === "error" && <FaExclamationCircle size={20} />}
              {t.type === "info" && <FaInfoCircle size={20} />}
            </div>
            <div className="toast-content">
              {t.title && <div className="toast-title">{t.title}</div>}
              <div className="toast-message">{t.message}</div>
            </div>
            <button
              className="toast-close"
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss notification"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  return context || defaultToast;
}
