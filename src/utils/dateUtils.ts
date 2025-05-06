export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    weekday: "long", // Hiển thị thứ (ví dụ: Thứ Hai)
    year: "numeric", // Hiển thị năm
    month: "long", // Hiển thị tháng (ví dụ: Tháng Năm)
    day: "numeric", // Hiển thị ngày
    hour: "2-digit", // Hiển thị giờ
    minute: "2-digit", // Hiển thị phút
  });
};