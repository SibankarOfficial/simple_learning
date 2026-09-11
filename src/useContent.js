import { useEffect, useState } from 'react';
import { fetchJson } from './content.js';

export default function useContent(path, validate = value => value) {
  const [state, setState] = useState({ path: null });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ path });
    fetchJson(path, controller.signal).then(value => {
      const data = validate(value);
      if (!controller.signal.aborted) setState({ path, data });
    }).catch(error => {
      if (!controller.signal.aborted) setState({ path, error: error.message });
    });
    return () => controller.abort();
  }, [path, retry]);
  return { ...(state.path === path ? state : {}), retry: () => setRetry(n => n + 1) };
}
