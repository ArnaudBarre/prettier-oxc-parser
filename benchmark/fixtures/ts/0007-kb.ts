// 中サイズのTypeScriptファイル
// 参考: State management libraryから抽出

import { useCallback, useEffect, useRef, useState } from 'react';

type Listener<T> = (state: T) => void;
type Unsubscribe = () => void;
type SetState<T> = (partial: T | ((state: T) => T)) => void;

export interface CreateStoreOptions<T> {
  name?: string;
  initialState: T;
  middleware?: Array<(setStateAction: T | ((state: T) => T), prevState: T, nextState: T) => T>;
  onStateChanged?: (prevState: T, nextState: T) => void;
  devtools?: boolean;
  storageKey?: string;
  storageAdapter?: StorageAdapter<T>;
}

export interface StorageAdapter<T> {
  getItem(key: string): T | null;
  setItem(key: string, value: T): void;
}

export interface Store<T> {
  getState: () => T;
  setState: SetState<T>;
  subscribe: (listener: Listener<T>) => Unsubscribe;
  destroy: () => void;
}

export const createStore = <T extends Record<string, any>>(options: CreateStoreOptions<T>): Store<T> => {
  const {
    name = 'store',
    initialState,
    middleware = [],
    onStateChanged,
    devtools = false,
    storageKey,
    storageAdapter,
  } = options;

  let state = initialState;
  let listeners: Set<Listener<T>> = new Set();
  
  // Restore from storage if available
  if (storageKey && storageAdapter) {
    const storedState = storageAdapter.getItem(storageKey);
    if (storedState) {
      state = { ...initialState, ...storedState };
    }
  }
  
  // DevTools connection
  let devtoolsConnection: any = null;
  if (devtools && typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION__) {
    devtoolsConnection = (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect({
      name,
      features: {
        jump: true,
        skip: false,
      },
    });
    
    devtoolsConnection.init(state);
    
    devtoolsConnection.subscribe((message: any) => {
      if (message.type === 'DISPATCH' && message.state) {
        try {
          const devState = JSON.parse(message.state);
          state = devState;
          notifyListeners();
        } catch (e) {
          console.error('Error processing devtools message:', e);
        }
      }
    });
  }

  const getState = (): T => state;

  const setState: SetState<T> = (partial) => {
    const prevState = { ...state };
    
    const nextState = typeof partial === 'function'
      ? (partial as ((state: T) => T))(prevState)
      : { ...prevState, ...partial };
    
    // Apply middleware
    let processedState = nextState;
    for (const middlewareFn of middleware) {
      processedState = middlewareFn(partial, prevState, processedState);
    }
    
    state = processedState;
    
    // Update storage if available
    if (storageKey && storageAdapter) {
      storageAdapter.setItem(storageKey, state);
    }
    
    // Update devtools
    if (devtoolsConnection) {
      const actionName = typeof partial === 'function' ? 'function' : Object.keys(partial as object).join(', ');
      devtoolsConnection.send({ type: actionName }, state);
    }
    
    // Notify state change callback
    if (onStateChanged) {
      onStateChanged(prevState, state);
    }
    
    notifyListeners();
  };

  const subscribe = (listener: Listener<T>): Unsubscribe => {
    listeners.add(listener);
    
    return () => {
      listeners.delete(listener);
    };
  };

  const notifyListeners = () => {
    listeners.forEach((listener) => {
      listener(state);
    });
  };

  const destroy = () => {
    listeners.clear();
    
    if (devtoolsConnection) {
      devtoolsConnection.unsubscribe();
    }
  };

  return {
    getState,
    setState,
    subscribe,
    destroy,
  };
};

// Local storage adapter implementation
export const createLocalStorageAdapter = <T>(): StorageAdapter<T> => {
  return {
    getItem(key: string): T | null {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
      }
    },
    setItem(key: string, value: T): void {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error('Error writing to localStorage:', e);
      }
    },
  };
};

// Session storage adapter implementation
export const createSessionStorageAdapter = <T>(): StorageAdapter<T> => {
  return {
    getItem(key: string): T | null {
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.error('Error reading from sessionStorage:', e);
        return null;
      }
    },
    setItem(key: string, value: T): void {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error('Error writing to sessionStorage:', e);
      }
    },
  };
};

// React hook for using the store
export const useStore = <T extends Record<string, any>, S = T>(
  store: Store<T>,
  selector: (state: T) => S = (state => state as unknown as S)
): [S, SetState<T>] => {
  const [state, setState] = useState<S>(selector(store.getState()));
  const selectorRef = useRef(selector);
  
  // Update selector ref when selector changes
  useEffect(() => {
    selectorRef.current = selector;
  }, [selector]);
  
  useEffect(() => {
    // Initial state
    setState(selectorRef.current(store.getState()));
    
    // Subscribe to changes
    const unsubscribe = store.subscribe((nextState) => {
      setState(selectorRef.current(nextState));
    });
    
    return unsubscribe;
  }, [store]);
  
  return [state, store.setState];
};

// Create a selector hook for a specific store
export const createStoreHook = <T extends Record<string, any>>(store: Store<T>) => {
  return <S = T>(selector: (state: T) => S = (state => state as unknown as S)): [S, SetState<T>] => {
    return useStore(store, selector);
  };
};

// Middleware for logging
export const createLoggerMiddleware = <T>(options?: { 
  logger?: (message: string, ...args: any[]) => void;
  collapsed?: boolean;
}) => {
  const { 
    logger = console.log,
    collapsed = false 
  } = options || {};
  
  return (action: T | ((state: T) => T), prevState: T, nextState: T) => {
    const actionType = typeof action === 'function' ? 'Function' : JSON.stringify(action);
    
    if (collapsed) {
      logger(
        `%c action %c${actionType}`,
        'color: gray; font-weight: bold;',
        'color: black;'
      );
      logger(
        '%c prev state',
        'color: gray; font-weight: bold;',
        prevState
      );
      logger(
        '%c next state',
        'color: green; font-weight: bold;',
        nextState
      );
    } else {
      logger(`Action: ${actionType}`);
      logger('Previous State:', prevState);
      logger('Next State:', nextState);
    }
    
    return nextState;
  };
};

// Middleware for handling async actions
export const createThunkMiddleware = <T>() => {
  return (action: T | ((state: T) => T), prevState: T, nextState: T) => {
    if (typeof action === 'function') {
      return nextState;
    }
    
    return nextState;
  };
};