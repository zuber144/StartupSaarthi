import { useState, useEffect, useRef } from 'react';
import { request, startupsAPI } from './api';

/**
 * Dependency-Free Implementation of a Centralized Store.
 * Optimized to prevent white-screen crashes and infinite re-render loops.
 */

let state = {
  startup: null,
  analysis: null,
  meta: null,
  logs: [],
  isRunning: false,
  error: null,
  isHydrated: false,
};

const listeners = new Set();

const setState = (next) => {
  state = { ...state, ...(typeof next === 'function' ? next(state) : next) };
  listeners.forEach((l) => l(state));
};

// ── Actions ──────────────────────────────────────────────────────────────

const actions = {
  addLog: (message) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setState((s) => ({
      logs: [...s.logs, { timestamp, message }]
    }));
  },

  hydrate: async () => {
    try {
      const startups = await startupsAPI.list();
      if (!startups.length) {
        setState({ isHydrated: true });
        return;
      }
      
      const startup = startups[0];
      setState({ startup });

      const res = await request(`/ai/latest/${startup.id}`);
      
      if (res.status !== 'no_analysis') {
        setState({ 
          analysis: res.data || res.results || res,
          meta: res.meta,
          error: null
        });
      }
    } catch (err) {
      console.error('[Store] Hydration failed:', err);
      setState({ error: 'Failed to sync with intelligence platform.' });
    } finally {
      setState({ isHydrated: true });
    }
  },

  runAnalysis: async (force = true) => {
    const { startup, isRunning } = state;
    if (!startup || isRunning) return;

    setState({ isRunning: true, error: null, logs: [] });
    
    actions.addLog('[MasterAgent] Intelligence request received.');
    actions.addLog('[MasterAgent] Classifying intent and mapping sub-agents...');
    
    const logTimeline = [
      { msg: '[MasterAgent] Spawning specialized agents (Research + Strategy)...', delay: 1500 },
      { msg: '[ResearchAgent] Querying scheme database and matching rules...', delay: 3500 },
      { msg: '[StrategyAgent] Computing readiness and building roadmap...', delay: 6500 },
      { msg: '[ValidationAgent] Auditing results for accuracy and truthfulness...', delay: 9500 },
      { msg: '[MasterAgent] Consolidating into Intelligence Contract v1.0...', delay: 11500 },
    ];

    const timeouts = logTimeline.map(item => 
      setTimeout(() => actions.addLog(item.msg), item.delay)
    );

    try {
      const result = await request('/ai/analyze', {
        method: 'POST',
        body: JSON.stringify({ 
          startup_id: startup.id, 
          user_input: 'Complete startup funding analysis', 
          force 
        }),
      });

      timeouts.forEach(clearTimeout);

      if (result && (result.data || result.results)) {
        const data = result.data || result.results || result;
        actions.addLog('[MasterAgent] ✓ Analysis successfully persisted to database.');
        setState({ 
          analysis: data, 
          meta: result.meta,
          isRunning: false 
        });
      } else {
        throw new Error('Invalid response from intelligence engine.');
      }
    } catch (err) {
      timeouts.forEach(clearTimeout);
      actions.addLog(`[MasterAgent] ✗ Critical failure: ${err.message}`);
      setState({ 
        error: `Intelligence Engine Error: ${err.message}`, 
        isRunning: false 
      });
    }
  }
};

/**
 * Shallow Equality Helper
 */
const shallowEqual = (a, b) => {
  if (a === b) return true;
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (let key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key) || a[key] !== b[key]) return false;
  }
  return true;
};

/**
 * useAnalysisStore Hook
 */
export const useAnalysisStore = (selector = (s) => s) => {
  const [, forceUpdate] = useState(0);
  const combined = { ...state, ...actions };
  const lastSelectedState = useRef(selector(combined));

  // Sync ref on every render to ensure it's up to date with the latest state
  lastSelectedState.current = selector(combined);

  useEffect(() => {
    const listener = (newState) => {
      const nextCombined = { ...newState, ...actions };
      const newSelected = selector(nextCombined);
      
      if (!shallowEqual(newSelected, lastSelectedState.current)) {
        lastSelectedState.current = newSelected;
        forceUpdate((c) => c + 1);
      }
    };
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, [selector]);

  return lastSelectedState.current;
};

// Static access to actions
Object.assign(useAnalysisStore, actions);

export default useAnalysisStore;
