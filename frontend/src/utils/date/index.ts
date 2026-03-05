export const formatTimeWithHoursWithoutTimeZone = (value: string) => {
  const pad = (v: number) => String(v).padStart(2, "0");

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return value;
  }

  return (
    `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
};
