// "12 Oct, 6:30 PM"
export const fmtDate = (iso: string | Date): string => {
  const d = new Date(iso);
  return (
    d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) +
    ', ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  );
};

// Friendly countdown used on task cards: "Overdue by 2h", "3d left"
export const timeLeft = (iso: string): string => {
  const diff = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(diff);
  const mins = Math.floor(abs / 6e4);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  const txt = days > 0 ? `${days}d` : hrs > 0 ? `${hrs}h` : `${mins}m`;
  return diff < 0 ? `Overdue by ${txt}` : `${txt} left`;
};
