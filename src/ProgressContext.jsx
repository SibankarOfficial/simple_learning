import { createContext, useContext, useRef, useState } from "react";
import { emptyProgress, loadProgress, STORAGE_KEY } from "./progress.js";

const Context = createContext(null);
export function ProgressProvider({ children }) {
  const [initial] = useState(() => {
    try {
      return loadProgress(window.localStorage);
    } catch {
      return {
        data: emptyProgress(),
        warning:
          "Browser storage is unavailable. Work will stay in this session only.",
      };
    }
  });
  const [progress, setProgress] = useState(initial.data);
  const current = useRef(initial.data);
  const [warning, setWarning] = useState(initial.warning);
  function change(update) {
    const next = update(current.current);
    current.current = next;
    setProgress(next);
    if (initial.readOnly) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setWarning("");
    } catch {
      setWarning(
        "This browser could not save your work. Keep this page open; changes will be lost when it closes.",
      );
    }
  }
  return (
    <Context.Provider value={{ progress, change, warning }}>
      {warning && (
        <div className="storage-warning" role="status">
          {warning}
        </div>
      )}
      {children}
    </Context.Provider>
  );
}
export const useProgress = () => useContext(Context);
