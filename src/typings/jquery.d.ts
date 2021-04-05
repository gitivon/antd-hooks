declare module 'jquery' {
  interface ArrayLike<T> {
    [index: number]: T;
    length: number;
  }

  interface JQueryEvent<E extends Event> {
    code?: number;
    target: E['target'];
  }

  type EventHandler = (e: JQueryEvent<Event>) => void;
  export interface JQuery extends ArrayLike<HTMLElement> {
    on(event: string, fn: EventHandler): void;
  }

  type jQueryAjax = (url: string, options?: any) => void;

  export interface JQueryStatic {
    (selector: Function): JQuery;
    (selector: string): JQuery;
    Deferred: () => void;
    ajax: jQueryAjax;
  }

  export const jQuery: JQueryStatic;
  export default jQuery;
}
