declare module "react-dom" {
  export function useFormState<State, Payload = FormData>(
    action: (state: State, payload: Payload) => State | Promise<State>,
    initialState: State,
  ): [State, (payload: Payload) => void];
  export function useFormStatus(): {
    pending: boolean;
    data?: FormData | null;
    method?: string | null;
    action?: string | null;
  };
}

declare module "better-sqlite3" {
  interface RunResult {
    changes: number;
    lastInsertRowid: number | bigint;
  }

  interface Statement<TResult = unknown> {
    run(...params: unknown[]): RunResult;
    get(...params: unknown[]): TResult;
    all(...params: unknown[]): TResult[];
  }

  class Database {
    constructor(filename?: string, options?: { readonly?: boolean; fileMustExist?: boolean; timeout?: number; verbose?: (...params: unknown[]) => void });
    prepare<TResult = unknown>(source: string): Statement<TResult>;
    exec(source: string): this;
    pragma(source: string): unknown;
    transaction<T extends (...params: any[]) => any>(fn: T): T;
  }

  export = Database;
}
