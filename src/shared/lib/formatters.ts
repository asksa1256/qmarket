export const formatDate = (targetDate: string) => {
  if (!targetDate) return "";

  const date = new Date(targetDate);

  const options: Intl.DateTimeFormatOptions = {
    month: "2-digit", // MM
    day: "2-digit", // DD
    hour: "2-digit", // HH
    minute: "2-digit", // MM
    hour12: false, // 24시간 형식 (00-23)
    timeZone: "Asia/Seoul", // 한국 표준시 설정
  };

  const formatter = new Intl.DateTimeFormat("ko-KR", options);
  const formattedDate = formatter.format(date);

  const parts = formattedDate.split(/[.\s]/).filter((p) => p !== ""); // ['MM', 'DD', 'HH:MM']
  const finalFormatted = `${parts[0]}-${parts[1]} ${parts[2]}`;

  return finalFormatted;
};

export const formatDateYMD = (targetDate: string) => {
  if (!targetDate) return "";

  const date = new Date(targetDate);

  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}:${secs}`;
};

export const formatRelativeTime = (targetDate: string) => {
  const now = Date.now();
  const timestampTarget = new Date(targetDate).getTime();

  const passedSecond = Math.floor((now - timestampTarget) / 1000);
  const passedMinute = Math.floor(passedSecond / 60);
  const passedHour = Math.floor(passedMinute / 60);
  const passedDay = Math.floor(passedHour / 24);
  const passedMonth = Math.floor(passedDay / 30.4375);
  const passedYear = Math.floor(passedMonth / 12);

  if (passedYear > 0) {
    return `${passedYear}년 전`;
  }
  if (passedMonth > 0) {
    return `${passedMonth}달 전`;
  }
  if (passedDay > 0) {
    return `${passedDay}일 전`;
  }
  if (passedHour > 0) {
    return `${passedHour}시간 전`;
  }
  if (passedMinute > 0) {
    return `${passedMinute}분 전`;
  }
  if (passedSecond > 0) {
    return `${passedSecond}초 전`;
  }
  return "방금 전";
};
