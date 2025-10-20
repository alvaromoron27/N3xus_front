export function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} segundos`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} horas`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} días`;
  else return `${Math.floor(diffInSeconds / 604800)} semanas`;
}
