declare module "better-sqlite3" {
  export interface RunResult {
    changes: number;
    lastInsertRowid: number;
  }

  export interface Statement<Result = unknown, BindParameters = unknown[]> {
    run(...params: BindParameters extends unknown[] ? BindParameters : [BindParameters]): RunResult;
    get(
      ...params: BindParameters extends unknown[] ? BindParameters : [BindParameters]
    ): Result | undefined;
    all(
      ...params: BindParameters extends unknown[] ? BindParameters : [BindParameters]
    ): Result[];
    iterate(
      ...params: BindParameters extends unknown[] ? BindParameters : [BindParameters]
    ): IterableIterator<Result>;
    pluck(toggle?: boolean): this;
    raw(toggle?: boolean): this;
    bind(...params: BindParameters extends unknown[] ? BindParameters : [BindParameters]): this;
  }

  export interface DatabaseOptions {
    fileMustExist?: boolean;
    memory?: boolean;
    readonly?: boolean;
    timeout?: number;
    verbose?: (...params: unknown[]) => void;
  }

  class Database {
    constructor(filename: string, options?: DatabaseOptions);
    prepare<Result = unknown, BindParameters = unknown[]>(source: string): Statement<Result, BindParameters>;
    transaction<Args extends unknown[], Result>(fn: (...args: Args) => Result): (...args: Args) => Result;
    pragma(source: string): unknown;
    exec(source: string): this;
    close(): void;
  }

  export = Database;
}
