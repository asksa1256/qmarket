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
