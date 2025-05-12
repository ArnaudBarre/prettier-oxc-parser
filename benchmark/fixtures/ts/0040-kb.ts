// 大きめのTypeScriptファイル（約80KB）
// 参考: 状態管理ライブラリやルーティングライブラリなどからインスパイア

// 型定義
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type ActionType = string;

export interface Action<T extends ActionType = ActionType, P = any> {
  type: T;
  payload?: P;
  meta?: any;
  error?: boolean;
}

export interface AnyAction extends Action {
  [extraProps: string]: any;
}

export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A
) => S;

export type ReducersMapObject<S = any, A extends Action = AnyAction> = {
  [K in keyof S]: Reducer<S[K], A>;
};

export type Dispatch<A extends Action = AnyAction> = <T extends A>(action: T) => T;

export interface MiddlewareAPI<D extends Dispatch = Dispatch, S = any> {
  dispatch: D;
  getState(): S;
}

export interface Middleware<
  _DispatchExt = {}, // 拡張されたディスパッチを型付けする際に使用
  S = any, // 状態の型
  D extends Dispatch = Dispatch // ディスパッチの型
> {
  (api: MiddlewareAPI<D, S>): (
    next: D
  ) => (action: any) => any;
}

export type StoreEnhancer<Ext = {}, StateExt = {}> = (
  next: StoreCreator
) => StoreCreator<Ext, StateExt>;

export type StoreCreator<Ext = {}, StateExt = {}> = <
  S = any,
  A extends Action = AnyAction
>(
  reducer: Reducer<S, A>,
  preloadedState?: DeepPartial<S>
) => Store<S & StateExt, A> & Ext;

export interface Store<S = any, A extends Action = AnyAction> {
  dispatch: Dispatch<A>;
  getState(): S;
  subscribe(listener: () => void): () => void;
  replaceReducer(nextReducer: Reducer<S, A>): void;
}

export type Selector<S, R> = (state: S) => R;

export type ThunkAction<R, S, E, A extends Action> = (
  dispatch: ThunkDispatch<S, E, A>,
  getState: () => S,
  extraArgument: E
) => R;

export type ThunkDispatch<S, E, A extends Action> = (
  action: A | ThunkAction<any, S, E, A>
) => any;

// ユーティリティ関数
export function compose<R>(...funcs: Array<(a: R) => R>): (a: R) => R {
  if (funcs.length === 0) {
    return (arg) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(
    (a, b) => (...args) => a(b(...args))
  );
}

// ミドルウェアの適用
export function applyMiddleware<Ext = {}, S = any>(
  ...middlewares: Middleware<any, S, any>[]
): StoreEnhancer<{ dispatch: any }> {
  return (createStore: StoreCreator) => <State, Action extends AnyAction>(
    reducer: Reducer<State, Action>,
    preloadedState?: DeepPartial<State>
  ) => {
    const store = createStore(reducer, preloadedState);
    let dispatch: Dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
        'Other middleware would not be applied to this dispatch.'
      );
    };

    const middlewareAPI: MiddlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args),
    };
    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = compose<typeof store.dispatch>(...chain)(store.dispatch);

    return {
      ...store,
      dispatch,
    };
  };
}

// ストア作成関数
export function createStore<S, A extends Action = AnyAction>(
  reducer: Reducer<S, A>,
  preloadedState?: DeepPartial<S>,
  enhancer?: StoreEnhancer
): Store<S, A> {
  if (typeof enhancer !== 'undefined') {
    return enhancer(createStore)(reducer, preloadedState) as Store<S, A>;
  }

  let currentReducer = reducer;
  let currentState = preloadedState as unknown as S;
  let currentListeners: Array<() => void> = [];
  let nextListeners = currentListeners;
  let isDispatching = false;

  // リスナー配列のシャローコピーを作成
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  // 現在の状態を取得
  function getState(): S {
    if (isDispatching) {
      throw new Error(
        'You may not call store.getState() while the reducer is executing. ' +
        'The reducer has already received the state as an argument. ' +
        'Pass it down from the top reducer instead of reading it from the store.'
      );
    }

    return currentState;
  }

  // リスナーを購読
  function subscribe(listener: () => void): () => void {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    if (isDispatching) {
      throw new Error(
        'You may not call store.subscribe() while the reducer is executing. ' +
        'If you would like to be notified after the store has been updated, subscribe from a ' +
        'component and invoke store.getState() in the callback to access the latest state. ' +
        'See https://redux.js.org/api-reference/store#subscribelistener for more details.'
      );
    }

    let isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error(
          'You may not unsubscribe from a store listener while the reducer is executing. ' +
          'See https://redux.js.org/api-reference/store#subscribelistener for more details.'
        );
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      const index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = [];
    };
  }

  // アクションをディスパッチ
  function dispatch(action: A): A {
    if (!isPlainObject(action)) {
      throw new Error(
        'Actions must be plain objects. ' +
        'Use custom middleware for async actions.'
      );
    }

    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
        'Have you misspelled a constant?'
      );
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    const listeners = (currentListeners = nextListeners);
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }

    return action;
  }

  // レデューサーを置き換え
  function replaceReducer(nextReducer: Reducer<S, A>): void {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: '@@redux/INIT' } as unknown as A);
  }

  // 初期アクションをディスパッチして初期状態を読み込む
  dispatch({ type: '@@redux/INIT' } as unknown as A);

  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
  };
}

// 複数のレデューサーを結合
export function combineReducers<S, A extends Action = AnyAction>(
  reducers: ReducersMapObject<S, A>
): Reducer<S, A> {
  const reducerKeys = Object.keys(reducers) as Array<keyof S>;
  const finalReducers: ReducersMapObject<S, A> = {} as any;
  
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  
  const finalReducerKeys = Object.keys(finalReducers) as Array<keyof S>;

  return function combination(state: S = {} as S, action: A): S {
    let hasChanged = false;
    const nextState: S = {} as S;
    
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i];
      const reducer = finalReducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      
      if (typeof nextStateForKey === 'undefined') {
        const actionType = action.type;
        throw new Error(
          `When called with an action of type ${
            actionType ? `"\${String(actionType)}"` : '(unknown type)'
          }, the slice reducer for key "${String(key)}" returned undefined. ` +
          'To ignore an action, you must explicitly return the previous state. ' +
          'If you want this reducer to hold no value, you can return null instead of undefined.'
        );
      }
      
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    
    return hasChanged ? nextState : state;
  };
}

// アクションクリエーター
export function createAction<T extends string, P = void>(
  type: T
): P extends void
  ? () => Action<T>
  : (payload: P) => Action<T, P> {
  return ((payload?: P) => ({ type, payload })) as any;
}

// シリーズオブジェクトチェック
function isPlainObject(obj: any): boolean {
  if (typeof obj !== 'object' || obj === null) return false;

  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

// セレクタ作成ユーティリティ
export function createSelector<S, R1, Result>(
  selector1: Selector<S, R1>,
  resultFunc: (res1: R1) => Result
): Selector<S, Result>;
export function createSelector<S, R1, R2, Result>(
  selector1: Selector<S, R1>,
  selector2: Selector<S, R2>,
  resultFunc: (res1: R1, res2: R2) => Result
): Selector<S, Result>;
export function createSelector<S, R1, R2, R3, Result>(
  selector1: Selector<S, R1>,
  selector2: Selector<S, R2>,
  selector3: Selector<S, R3>,
  resultFunc: (res1: R1, res2: R2, res3: R3) => Result
): Selector<S, Result>;
export function createSelector<S, R1, R2, R3, R4, Result>(
  selector1: Selector<S, R1>,
  selector2: Selector<S, R2>,
  selector3: Selector<S, R3>,
  selector4: Selector<S, R4>,
  resultFunc: (res1: R1, res2: R2, res3: R3, res4: R4) => Result
): Selector<S, Result>;
export function createSelector<S, R1, R2, R3, R4, R5, Result>(
  selector1: Selector<S, R1>,
  selector2: Selector<S, R2>,
  selector3: Selector<S, R3>,
  selector4: Selector<S, R4>,
  selector5: Selector<S, R5>,
  resultFunc: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5) => Result
): Selector<S, Result>;
export function createSelector(...args: any[]): Selector<any, any> {
  const resultFunc = args.pop();
  const selectors = args;

  let lastResult: any = null;
  let lastArgs: any[] = [];
  let hasRunAtLeastOnce = false;

  return (state: any) => {
    const selectorsResults = selectors.map(selector => selector(state));
    const argsChanged = !hasRunAtLeastOnce || 
      selectorsResults.some((result, i) => result !== lastArgs[i]);

    if (argsChanged) {
      lastResult = resultFunc(...selectorsResults);
      lastArgs = selectorsResults;
      hasRunAtLeastOnce = true;
    }

    return lastResult;
  };
}

// ルーティング関連の型定義
export interface RouteParams {
  [key: string]: string;
}

export interface Location {
  pathname: string;
  search: string;
  hash: string;
  state: any;
}

export interface History {
  length: number;
  location: Location;
  action: 'PUSH' | 'REPLACE' | 'POP';
  push(path: string, state?: any): void;
  replace(path: string, state?: any): void;
  go(n: number): void;
  goBack(): void;
  goForward(): void;
  listen(listener: (location: Location, action: string) => void): () => void;
  block(blocker: (tx: { retry(): void }) => void): () => void;
}

export interface RouteObject {
  path: string;
  element?: React.ReactNode;
  children?: RouteObject[];
  caseSensitive?: boolean;
  index?: boolean;
}

export interface RouteMatch {
  params: RouteParams;
  pathname: string;
  route: RouteObject;
}

// ルーティングロジック
export function matchRoutes(
  routes: RouteObject[],
  location: Location | string,
  basename: string = ''
): RouteMatch[] | null {
  const pathname = typeof location === 'string' ? location : location.pathname;
  const stripBasename = (path: string, basename: string): string => {
    if (!basename) return path;
    const base = basename.endsWith('/') ? basename : basename + '/';
    return path.startsWith(base) ? path.slice(base.length) : path;
  };

  const stripTrailingSlash = (path: string): string => {
    return path.endsWith('/') ? path.slice(0, -1) : path;
  };

  const addLeadingSlash = (path: string): string => {
    return path.startsWith('/') ? path : '/' + path;
  };

  const normalizePathname = stripTrailingSlash(
    stripBasename(addLeadingSlash(pathname), basename)
  );

  return matchRoutesImpl(routes, normalizePathname);
}

function matchRoutesImpl(
  routes: RouteObject[],
  pathname: string,
  parentPath: string = ''
): RouteMatch[] | null {
  let matches: RouteMatch[] | null = null;

  for (const route of routes) {
    const pattern = parentPath + 
      (route.path ? 
        route.path.startsWith('/') ? 
          route.path : 
          (parentPath.endsWith('/') ? route.path : '/' + route.path) : 
        '');
    
    const match = matchPath(pattern, pathname, route.caseSensitive);

    if (match) {
      matches = [
        {
          params: match.params,
          pathname: match.pathname,
          route
        }
      ];

      if (route.children) {
        const childMatches = matchRoutesImpl(
          route.children,
          pathname,
          pattern
        );

        if (childMatches) {
          matches = [...matches, ...childMatches];
        }
      }

      return matches;
    }
  }

  return matches;
}

interface PathMatch {
  params: RouteParams;
  pathname: string;
}

function matchPath(
  pattern: string,
  pathname: string,
  caseSensitive: boolean = false
): PathMatch | null {
  // 簡易的なパスマッチング実装
  const paramNames: string[] = [];
  const regexpSource = '^' + 
    pattern
      .replace(/^\/*/, '/') // 先頭のスラッシュを正規化
      .replace(/\/+$/, '') // 末尾のスラッシュを削除
      .replace(/:(\\w+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return '([^\\/]+)';
      })
      .replace(/\\*/, '.*')
      .replace(/\/$/, '') + 
    '/?$';

  const match = new RegExp(regexpSource, caseSensitive ? undefined : 'i')
    .exec(pathname);

  if (!match) return null;

  const params: RouteParams = {};
  for (let i = 1; i < match.length; i++) {
    params[paramNames[i - 1]] = match[i];
  }

  return {
    params,
    pathname: match[0]
  };
}

// リアクティブなデータストアの実装
interface Subscriber<T> {
  callback: (value: T) => void;
  dependencies?: string[];
}

export class Store2<T extends Record<string, any>> {
  private state: T;
  private subscribers: Map<number, Subscriber<Partial<T>>> = new Map();
  private subscriptionCounter: number = 0;

  constructor(initialState: T) {
    this.state = { ...initialState };
  }

  get<K extends keyof T>(key: K): T[K] {
    return this.state[key];
  }

  getState(): Readonly<T> {
    return { ...this.state };
  }

  set<K extends keyof T>(key: K, value: T[K]): void {
    if (this.state[key] === value) return;
    
    this.state = { ...this.state, [key]: value };
    this.notifySubscribers(key as string);
  }

  update(partialState: Partial<T>): void {
    let hasChanged = false;
    const changedKeys: string[] = [];
    
    for (const key in partialState) {
      if (this.state[key] !== partialState[key]) {
        hasChanged = true;
        changedKeys.push(key);
      }
    }
    
    if (!hasChanged) return;
    
    this.state = { ...this.state, ...partialState };
    this.notifySubscribers(...changedKeys);
  }

  subscribe(
    callback: (value: Partial<T>) => void,
    dependencies?: Array<keyof T>
  ): () => void {
    const id = this.subscriptionCounter++;
    this.subscribers.set(id, {
      callback,
      dependencies: dependencies?.map(key => key as string)
    });
    
    return () => {
      this.subscribers.delete(id);
    };
  }

  private notifySubscribers(...changedKeys: string[]): void {
    const notifyQueue = new Set<number>();
    
    // 変更されたキーに依存するサブスクライバーを特定
    for (const [id, subscriber] of this.subscribers.entries()) {
      const { dependencies } = subscriber;
      
      if (!dependencies || dependencies.length === 0) {
        // 依存関係を指定していない場合は常に通知
        notifyQueue.add(id);
      } else if (changedKeys.some(key => dependencies.includes(key))) {
        // 変更されたキーに依存している場合に通知
        notifyQueue.add(id);
      }
    }
    
    // 通知対象の部分的な状態を構築
    const partialState: Partial<T> = {};
    for (const key of changedKeys) {
      partialState[key as keyof T] = this.state[key as keyof T];
    }
    
    // サブスクライバーに通知
    for (const id of notifyQueue) {
      const subscriber = this.subscribers.get(id);
      if (subscriber) {
        try {
          subscriber.callback(partialState);
        } catch (error) {
          console.error('Error in store subscriber callback:', error);
        }
      }
    }
  }

  destroy(): void {
    this.subscribers.clear();
  }
}

// 依存関係の注入システム
interface ProviderOptions {
  singleton?: boolean;
  factory?: boolean;
}

class Container {
  private bindings: Map<any, { 
    implementation: any;
    options: ProviderOptions;
    instance?: any;
  }> = new Map();

  bind<T>(token: any, implementation: any, options: ProviderOptions = {}): void {
    this.bindings.set(token, { implementation, options });
  }

  get<T>(token: any): T {
    const binding = this.bindings.get(token);
    
    if (!binding) {
      throw new Error(`No provider found for ${token.toString()}`);
    }
    
    const { implementation, options, instance } = binding;
    
    // シングルトンの場合、既存のインスタンスを返す
    if (options.singleton && instance) {
      return instance;
    }
    
    // ファクトリーの場合、実装を直接呼び出す
    if (options.factory) {
      return implementation();
    }
    
    // 通常のクラスの場合、依存関係を解決してインスタンス化
    const resolvedDependencies = this.resolveDependencies(implementation);
    const newInstance = new implementation(...resolvedDependencies);
    
    // シングルトンの場合、インスタンスを保存
    if (options.singleton) {
      binding.instance = newInstance;
    }
    
    return newInstance;
  }

  private resolveDependencies(target: any): any[] {
    if (!target.dependencies) {
      return [];
    }
    
    return target.dependencies.map((dependency: any) => this.get(dependency));
  }
}

// アスペクト指向プログラミングのサポート
type MethodDecorator<T> = (
  target: Object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;

type BeforeAdvice = (context: { 
  target: any; 
  methodName: string; 
  args: any[];
}) => void;

type AfterAdvice = (context: { 
  target: any; 
  methodName: string; 
  args: any[]; 
  result: any;
}) => void;

type AroundAdvice = (context: { 
  target: any; 
  methodName: string; 
  args: any[]; 
  proceed: () => any;
}) => any;

type ErrorAdvice = (context: { 
  target: any; 
  methodName: string; 
  args: any[]; 
  error: Error;
}) => void;

export function before(advice: BeforeAdvice): MethodDecorator<Function> {
  return function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) {
    const originalMethod = descriptor.value!;
    
    descriptor.value = function(...args: any[]) {
      advice({ target: this, methodName: propertyKey, args });
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

export function after(advice: AfterAdvice): MethodDecorator<Function> {
  return function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) {
    const originalMethod = descriptor.value!;
    
    descriptor.value = function(...args: any[]) {
      const result = originalMethod.apply(this, args);
      advice({ target: this, methodName: propertyKey, args, result });
      return result;
    };
    
    return descriptor;
  };
}

export function around(advice: AroundAdvice): MethodDecorator<Function> {
  return function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) {
    const originalMethod = descriptor.value!;
    
    descriptor.value = function(...args: any[]) {
      return advice({
        target: this,
        methodName: propertyKey,
        args,
        proceed: () => originalMethod.apply(this, args)
      });
    };
    
    return descriptor;
  };
}

export function catchError(advice: ErrorAdvice): MethodDecorator<Function> {
  return function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) {
    const originalMethod = descriptor.value!;
    
    descriptor.value = function(...args: any[]) {
      try {
        return originalMethod.apply(this, args);
      } catch (error) {
        advice({ target: this, methodName: propertyKey, args, error });
        throw error;
      }
    };
    
    return descriptor;
  };
}

// イベントバスの実装
interface EventListener<T> {
  callback: (payload: T) => void;
  once: boolean;
}

export class EventBus {
  private listeners: Map<string, Array<EventListener<any>>> = new Map();

  on<T>(event: string, callback: (payload: T) => void): () => void {
    this.registerListener(event, { callback, once: false });
    return () => this.off(event, callback);
  }

  once<T>(event: string, callback: (payload: T) => void): () => void {
    this.registerListener(event, { callback, once: true });
    return () => this.off(event, callback);
  }

  off<T>(event: string, callback?: (payload: T) => void): void {
    if (!callback) {
      // イベントのすべてのリスナーを削除
      this.listeners.delete(event);
      return;
    }
    
    const listeners = this.listeners.get(event);
    if (!listeners) return;
    
    const index = listeners.findIndex(listener => listener.callback === callback);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
    
    if (listeners.length === 0) {
      this.listeners.delete(event);
    }
  }

  emit<T>(event: string, payload?: T): void {
    const listeners = this.listeners.get(event);
    if (!listeners) return;
    
    // リスナーのコピーを作成して、処理中にリスナーリストが変更されても安全に実行できるようにする
    const listenersToCall = [...listeners];
    
    // 一度だけ実行するリスナーを特定して削除
    const onceListeners = listenersToCall
      .filter(listener => listener.once)
      .map(listener => listener.callback);
    
    if (onceListeners.length > 0) {
      this.listeners.set(
        event,
        listeners.filter(listener => {
          return !listener.once || !onceListeners.includes(listener.callback);
        })
      );
    }
    
    // リスナーを呼び出す
    for (const listener of listenersToCall) {
      try {
        listener.callback(payload);
      } catch (error) {
        console.error(`Error in event listener for "${event}":`, error);
      }
    }
  }

  clear(): void {
    this.listeners.clear();
  }

  private registerListener<T>(
    event: string,
    listener: EventListener<T>
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event)!.push(listener);
  }
}

// サービスワーカーユーティリティ
export class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private updateAvailable: boolean = false;
  private eventBus: EventBus = new EventBus();

  async register(scriptURL: string, options?: RegistrationOptions): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported in this browser');
      return false;
    }
    
    try {
      this.registration = await navigator.serviceWorker.register(scriptURL, options);
      console.log('Service worker registered successfully', this.registration);
      
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration!.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // この時点で更新が利用可能
                this.updateAvailable = true;
                this.eventBus.emit('update-available');
              } else {
                // 初回インストール
                this.eventBus.emit('installed');
              }
            }
          });
        }
      });
      
      // 既存のコントローラーを使用している場合
      if (navigator.serviceWorker.controller) {
        this.checkForUpdates();
      }
      
      // 更新のチェック用にリロード時のメッセージをリスニング
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        this.eventBus.emit('controller-changed');
      });
      
      return true;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      return false;
    }
  }

  async unregister(): Promise<boolean> {
    if (!this.registration) {
      console.warn('No service worker registered');
      return false;
    }
    
    try {
      const success = await this.registration.unregister();
      if (success) {
        this.registration = null;
        this.updateAvailable = false;
        this.eventBus.emit('unregistered');
        console.log('Service worker unregistered successfully');
      }
      return success;
    } catch (error) {
      console.error('Service worker unregistration failed:', error);
      return false;
    }
  }

  async update(): Promise<void> {
    if (!this.registration) {
      console.warn('No service worker registered');
      return;
    }
    
    try {
      await this.registration.update();
      console.log('Service worker update check initiated');
    } catch (error) {
      console.error('Service worker update check failed:', error);
    }
  }

  applyUpdate(): void {
    if (!this.updateAvailable) {
      console.warn('No update available to apply');
      return;
    }
    
    // 更新を適用するためにページを再読み込み
    this.eventBus.emit('updating');
    window.location.reload();
  }

  isUpdateAvailable(): boolean {
    return this.updateAvailable;
  }

  onUpdateAvailable(callback: () => void): () => void {
    return this.eventBus.on('update-available', callback);
  }

  onInstalled(callback: () => void): () => void {
    return this.eventBus.on('installed', callback);
  }

  onUnregistered(callback: () => void): () => void {
    return this.eventBus.on('unregistered', callback);
  }

  onUpdating(callback: () => void): () => void {
    return this.eventBus.on('updating', callback);
  }

  onControllerChanged(callback: () => void): () => void {
    return this.eventBus.on('controller-changed', callback);
  }

  private async checkForUpdates(): Promise<void> {
    if (!this.registration) return;
    
    try {
      // キャッシュバスティング用のタイムスタンプクエリを追加したURLを取得
      const registrationURL = this.registration.active?.scriptURL;
      if (registrationURL) {
        const url = new URL(registrationURL);
        url.searchParams.set('_sw-cache', Date.now().toString());
        
        const response = await fetch(url.toString(), { cache: 'no-cache' });
        
        if (response.ok) {
          const fetchedText = await response.text();
          const activeText = await this.getActiveWorkerText();
          
          if (activeText && fetchedText !== activeText) {
            // スクリプトが変更されたため更新が利用可能
            this.updateAvailable = true;
            this.eventBus.emit('update-available');
          }
        }
      }
    } catch (error) {
      console.error('Failed to check for service worker updates:', error);
    }
  }

  private async getActiveWorkerText(): Promise<string | null> {
    if (!this.registration?.active?.scriptURL) return null;
    
    try {
      const response = await fetch(this.registration.active.scriptURL, { 
        cache: 'no-cache' 
      });
      
      if (response.ok) {
        return await response.text();
      }
      
      return null;
    } catch (error) {
      console.error('Failed to fetch active service worker text:', error);
      return null;
    }
  }
}

// エラーバウンダリの実装
export class ErrorBoundary {
  private static defaultErrorHandler: (error: Error, errorInfo: any) => void = 
    (error, errorInfo) => {
      console.error('Uncaught error in component:', error, errorInfo);
    };
  
  private static errorHandler = ErrorBoundary.defaultErrorHandler;

  static setErrorHandler(handler: (error: Error, errorInfo: any) => void): void {
    ErrorBoundary.errorHandler = handler;
  }

  static resetErrorHandler(): void {
    ErrorBoundary.errorHandler = ErrorBoundary.defaultErrorHandler;
  }

  static captureError(error: Error, errorInfo: any): void {
    try {
      ErrorBoundary.errorHandler(error, errorInfo);
    } catch (handlerError) {
      console.error('Error in error handler:', handlerError);
      ErrorBoundary.defaultErrorHandler(error, errorInfo);
    }
  }
}

// ネットワーク状態監視
export class NetworkMonitor {
  private online: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private eventBus: EventBus = new EventBus();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }
  }

  isOnline(): boolean {
    return this.online;
  }

  onStatusChange(callback: (online: boolean) => void): () => void {
    return this.eventBus.on('status-change', callback);
  }

  onOnline(callback: () => void): () => void {
    return this.eventBus.on('online', callback);
  }

  onOffline(callback: () => void): () => void {
    return this.eventBus.on('offline', callback);
  }

  destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
    
    this.eventBus.clear();
  }

  private handleOnline = (): void => {
    this.online = true;
    this.eventBus.emit('online');
    this.eventBus.emit('status-change', true);
  };

  private handleOffline = (): void => {
    this.online = false;
    this.eventBus.emit('offline');
    this.eventBus.emit('status-change', false);
  };
}

// 例: プロダクション用途のシンプルな状態管理ライブラリ
export class SimpleStore<T extends Record<string, any>> {
  private state: T;
  private listeners: Array<() => void> = [];
  private prevState: T;

  constructor(initialState: T) {
    this.state = { ...initialState };
    this.prevState = { ...initialState };
  }

  getState(): Readonly<T> {
    return { ...this.state };
  }

  setState(update: Partial<T> | ((state: T) => Partial<T>)): void {
    this.prevState = { ...this.state };
    
    const newPartialState = typeof update === 'function'
      ? update(this.state)
      : update;
    
    this.state = { ...this.state, ...newPartialState };
    
    this.notifyListeners();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getPrevState(): Readonly<T> {
    return { ...this.prevState };
  }

  resetState(newState: Partial<T> = {}): void {
    this.prevState = { ...this.state };
    this.state = { ...newState } as T;
    this.notifyListeners();
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }
}

// 例: アプリケーションの使用方法
interface AppState {
  counter: number;
  todos: Array<{ id: number; text: string; completed: boolean }>;
  user: { id: number; name: string } | null;
  theme: 'light' | 'dark';
  loading: boolean;
}

function createAppStore(): Store<AppState> {
  // カウンター機能のレデューサー
  const counterReducer: Reducer<number, AnyAction> = (state = 0, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return state + 1;
      case 'DECREMENT':
        return state - 1;
      case 'SET_COUNTER':
        return action.payload;
      default:
        return state;
    }
  };

  // TODOリスト機能のレデューサー
  const todosReducer: Reducer<Array<{ id: number; text: string; completed: boolean }>, AnyAction> = (
    state = [],
    action
  ) => {
    switch (action.type) {
      case 'ADD_TODO':
        return [
          ...state,
          {
            id: Date.now(),
            text: action.payload,
            completed: false
          }
        ];
      case 'TOGGLE_TODO':
        return state.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        );
      case 'REMOVE_TODO':
        return state.filter(todo => todo.id !== action.payload);
      default:
        return state;
    }
  };

  // ユーザー情報のレデューサー
  const userReducer: Reducer<{ id: number; name: string } | null, AnyAction> = (
    state = null,
    action
  ) => {
    switch (action.type) {
      case 'SET_USER':
        return action.payload;
      case 'CLEAR_USER':
        return null;
      default:
        return state;
    }
  };

  // テーマ設定のレデューサー
  const themeReducer: Reducer<'light' | 'dark', AnyAction> = (
    state = 'light',
    action
  ) => {
    switch (action.type) {
      case 'SET_THEME':
        return action.payload;
      case 'TOGGLE_THEME':
        return state === 'light' ? 'dark' : 'light';
      default:
        return state;
    }
  };

  // ローディング状態のレデューサー
  const loadingReducer: Reducer<boolean, AnyAction> = (
    state = false,
    action
  ) => {
    switch (action.type) {
      case 'SET_LOADING':
        return action.payload;
      default:
        return state;
    }
  };

  // すべてのレデューサーを結合
  const rootReducer = combineReducers<AppState>({
    counter: counterReducer,
    todos: todosReducer,
    user: userReducer,
    theme: themeReducer,
    loading: loadingReducer,
  });

  // アクションクリエーター
  const incrementCounter = createAction('INCREMENT');
  const decrementCounter = createAction<'DECREMENT'>();
  const setCounter = createAction<'SET_COUNTER', number>('SET_COUNTER');
  const addTodo = createAction<'ADD_TODO', string>('ADD_TODO');
  const toggleTodo = createAction<'TOGGLE_TODO', number>('TOGGLE_TODO');
  const removeTodo = createAction<'REMOVE_TODO', number>('REMOVE_TODO');
  const setUser = createAction<'SET_USER', { id: number; name: string }>('SET_USER');
  const clearUser = createAction('CLEAR_USER');
  const setTheme = createAction<'SET_THEME', 'light' | 'dark'>('SET_THEME');
  const toggleTheme = createAction('TOGGLE_THEME');
  const setLoading = createAction<'SET_LOADING', boolean>('SET_LOADING');

  // 非同期アクションのためのThunkミドルウェア
  const thunkMiddleware: Middleware = ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    return next(action);
  };

  // ロギングミドルウェア
  const loggingMiddleware: Middleware = ({ getState }) => next => action => {
    console.log('dispatching', action);
    const result = next(action);
    console.log('next state', getState());
    return result;
  };

  // ストアの作成
  const store = createStore(
    rootReducer,
    {
      counter: 0,
      todos: [],
      user: null,
      theme: 'light',
      loading: false,
    },
    applyMiddleware(thunkMiddleware, loggingMiddleware)
  );

  return store;
}

// メモ化されたセレクタの例
const selectCounter = (state: AppState) => state.counter;
const selectTodos = (state: AppState) => state.todos;
const selectUser = (state: AppState) => state.user;
const selectTheme = (state: AppState) => state.theme;

const selectCompletedTodos = createSelector(
  selectTodos,
  todos => todos.filter(todo => todo.completed)
);

const selectIncompleteTodos = createSelector(
  selectTodos,
  todos => todos.filter(todo => !todo.completed)
);

const selectTodoStats = createSelector(
  selectTodos,
  selectCompletedTodos,
  (todos, completedTodos) => ({
    total: todos.length,
    completed: completedTodos.length,
    incomplete: todos.length - completedTodos.length,
    percentComplete: todos.length > 0
      ? Math.round((completedTodos.length / todos.length) * 100)
      : 0
  })
);

// 例: コンテナの使用方法
const container = new Container();

class UserService {
  async getUserById(id: number): Promise<{ id: number; name: string }> {
    // 実際はAPIリクエストなど
    return { id, name: `User ${id}` };
  }
}

class TodoService {
  static dependencies = [UserService];
  
  constructor(private userService: UserService) {}
  
  async getTodosByUserId(userId: number): Promise<Array<{ id: number; text: string }>> {
    const user = await this.userService.getUserById(userId);
    // 実際はAPIリクエストなど
    return [
      { id: 1, text: `Task for ${user.name} #1` },
      { id: 2, text: `Task for ${user.name} #2` },
    ];
  }
}

container.bind(UserService, UserService, { singleton: true });
container.bind(TodoService, TodoService);

class ExampleController {
  async loadData(userId: number): Promise<void> {
    const todoService = container.get<TodoService>(TodoService);
    const todos = await todoService.getTodosByUserId(userId);
    console.log('Loaded todos:', todos);
  }
}

// イベントバスの例
const eventBus = new EventBus();

eventBus.on('user-login', (user: { id: number; name: string }) => {
  console.log('User logged in:', user);
});

eventBus.on('notification', (message: string) => {
  console.log('Notification:', message);
});

eventBus.emit('user-login', { id: 1, name: 'John Doe' });
eventBus.emit('notification', 'You have a new message');

// ネットワークモニターの例
const networkMonitor = new NetworkMonitor();

networkMonitor.onStatusChange(online => {
  console.log('Network status changed to:', online ? 'online' : 'offline');
});

// サービスワーカーマネージャーの例
const swManager = new ServiceWorkerManager();

swManager.onUpdateAvailable(() => {
  console.log('A new version of the app is available!');
});

async function initApp(): Promise<void> {
  await swManager.register('/service-worker.js');
}

// シンプルストアの例
const simpleStore = new SimpleStore<{ count: number; name: string }>({
  count: 0,
  name: 'Initial',
});

const unsubscribe = simpleStore.subscribe(() => {
  console.log('Store updated:', simpleStore.getState());
});

simpleStore.setState({ count: 1 });
simpleStore.setState(state => ({ count: state.count + 1 }));
