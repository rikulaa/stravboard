import type { Duration } from 'date-fns';

export const timeToDuration = (time: number): Duration => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  let result = "";
  if (hours > 0) {
    result += `${hours} hour${hours > 1 ? "s" : ""}, `;
  }
  if (minutes > 0) {
    result += `${minutes} minute${minutes > 1 ? "s" : ""}, `;
  }
  if (seconds > 0 || result === "") {
    result += `${seconds} second${seconds > 1 ? "s" : ""}`;
  }

  return {
    hours: hours > 0 ? hours : 0,
    minutes: minutes > 0 ? minutes : 0,
    seconds: seconds > 0 ? seconds : 0,
  }
};
