import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  // Set the new mode then add to history
  function transition (newMode, replace = false) {
    if (!replace) {
      setHistory(prev => [...prev, newMode])
      setMode(newMode)
    }
    setMode(newMode)
  }

  // Set the previous mode then remove the last one from history
  function back () {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1)
      setHistory(newHistory);
      setMode(newHistory[newHistory.length - 1]);
    }
  } 

  return { mode, transition, back };
}