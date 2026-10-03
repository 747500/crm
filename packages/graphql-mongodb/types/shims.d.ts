// Нетипизированные зависимости: минимальные шимы.

declare module 'graphql-fields-list' {
  export function fieldsList(info: unknown, options?: unknown): string[];
  export function fieldsMap(
    info: unknown,
    options?: unknown,
  ): Record<string, unknown>;
}
