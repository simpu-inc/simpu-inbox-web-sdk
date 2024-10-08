import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

export const formatMessageDateTime = (date: Date) => {
  const now = dayjs(new Date());
  const dayjsDate = dayjs(date);
  switch (true) {
    case now.diff(dayjsDate, "second") < 60:
      return "a few seconds ago";
    case dayjs().isToday():
      return dayjs(date).format("hh:mm a");
    case dayjs().isYesterday():
      return `Yesterday, ${dayjs(date).format("hh:mm a")}`;
    case now.diff(dayjsDate, "day") < 7:
      return dayjs(date).format("eee, hh:mm a ");
    case now.diff(dayjsDate, "year") === 0:
      return dayjs(date).format("DD MMM hh:mm a");
    default:
      return dayjs(date).format("DD MMM YYYY hh:mm a");
  }
};
