const pad = (n: number) => String(n).padStart(2, "0");

export const formatTimeWithHoursWithoutTimeZone = (value: string) => {
  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return value;
  }

  return (
    `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
};

export const toDatetimeLocal = (iso: string) => {
  const date = new Date(iso);

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
