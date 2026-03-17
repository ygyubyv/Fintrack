export const toArray = <T>(value: T | T[] | undefined): T[] | undefined => {
  if (!value) {
    return undefined;
  }

  return Array.isArray(value) ? value : [value];
};
