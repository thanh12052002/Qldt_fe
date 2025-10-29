// src/services/draftService.js
export const fetchDangKyTamList = async (token, sinhVienKhoaId) => {
  if (!token || !sinhVienKhoaId) return [];

  try {
    const res = await fetch(
      `http://localhost:8080/draft/mon-hoc-draft?sinhVienKhoaId=${sinhVienKhoaId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return await res.json();
  } catch (err) {
    console.error("❌ Lỗi khi gọi API danh sách đăng ký tạm:", err);
    throw err;
  }
};
