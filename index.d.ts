import {
  Reducer,
  ReducersMapObject,
  MiddlewareAPI,
  StoreEnhancer,
  Store,
} from 'redux';


/**
 * Redux_Action
 * @template T the type of the action's `type` tag.
 */
export interface Action<T = any> {
  type: T
}

/**
 * 支持扩展任意属性 Redux_Action
 * An Action type which accepts any other properties.
 * This is mainly for the use of the `Reducer` type.
 * This is not part of `Action` itself to prevent types that extend `Action` from
 * having an index signature.
 */
export interface AnyAction extends Action {
  // Allows any extra properties to be defined in an action.
  [extraProps: string]: any
}

/**
 * Dva_Action
 */
export interface DvaAction<T = any> extends Action<string> {
  payload?: T
}

/**
 * 支持扩展任意属性 Dva_Action
 */
export interface DvaAnyAction extends DvaAction {
  // Allows any extra properties to be defined in an action.
  [extraProps: string]: any
}

/**
 * TODO:目前无法兼容   T|Promise<any> 返回值约束
 * @template A The type of things (actions or otherwise) which may be
 *   dispatched.
 */
export interface Dispatch<A extends Action = DvaAnyAction> {
  <T extends A>(action: T): any
}


export interface onActionFunc {
  (api: MiddlewareAPI<any>): void,
}

export interface ReducerEnhancer {
  (reducer: Reducer<any>): void,
}

export interface Hooks {
  onError?: (e: Error, dispatch: Dispatch<any>) => void,
  onAction?: onActionFunc | onActionFunc[],
  onStateChange?: () => void,
  onReducer?: ReducerEnhancer,
  onEffect?: () => void,
  onHmr?: () => void,
  extraReducers?: ReducersMapObject,
  extraEnhancers?: StoreEnhancer<any>[],
}

export type HooksAndOpts = Hooks & {
  initialState?: Object,
}

export interface CreateOpts {
  initialState?: Object,
  setupApp?: Function,
}

export interface EffectsCommandMap {
  put: <A extends AnyAction>(action: A) => any,
  call: Function,
  select: Function,
  take: Function,
  cancel: Function,

  [key: string]: any,
}

export type Effect = (action: AnyAction, effects: EffectsCommandMap) => void;
export type EffectType = 'takeEvery' | 'takeLatest' | 'watcher' | 'throttle';
export type EffectWithType = [Effect, { type: EffectType }];
export type Subscription = (api: SubscriptionAPI, done: Function) => void;
export type ReducersMapObjectWithEnhancer = [ReducersMapObject, ReducerEnhancer];

export interface EffectsMapObject {
  [key: string]: Effect | EffectWithType,
}

export interface SubscriptionAPI {
  history: History,
  dispatch: Dispatch<any>,
}

export interface SubscriptionsMapObject {
  [key: string]: Subscription,
}

export interface Model {
  namespace: string,
  state?: any,
  reducers?: ReducersMapObject | ReducersMapObjectWithEnhancer,
  effects?: EffectsMapObject,
  subscriptions?: SubscriptionsMapObject,
}

export interface DvaStore extends Store<any> {
  runSaga: (saga: any) => any
}

export interface DvaInstance {
  /**
   * Register an object of hooks on the application.
   *
   * @param hooks
   */
  use: (hooks: Hooks) => void,

  /**
   * Register a model.
   *
   * @param model
   */
  model: (model: Model) => void,
  /**
   * Unregister a model.
   *
   * @param namespace
   */
  unmodel: (namespace: string) => void,
  start: () => any,
  _models: any,
  _plugins: Plugin,
  _store: DvaStore
}

export function create(hooksAndOpts?: HooksAndOpts, createOpts?: CreateOpts): DvaInstance;
