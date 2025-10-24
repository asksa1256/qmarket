export const formatDate = (targetDate: string) => {
  if (!targetDate) return "";

  const date = new Date(targetDate);

  // 한국 시간대 (KST, UTC+9) 포맷 지정
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
  const koreaDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  const year = String(koreaDate.getFullYear()).slice(2);
  const month = String(koreaDate.getMonth() + 1).padStart(2, "0");
  const day = String(koreaDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
