export const toArray = <T>(value: T | T[] | undefined): T[] | undefined => {
  if (!value) {
    return undefined;
  }

  return Array.isArray(value) ? value : [value];
};

export const stringToBoolean = (value: unknown) => {
  return value === "true" ? true : false;
};
