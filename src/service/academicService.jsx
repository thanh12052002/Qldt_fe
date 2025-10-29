// src/services/academicService.js
export const fetchMonHoc = async (token, selectedMajor, selectedSemester) => {
  if (!token || !selectedMajor || !selectedSemester)
    return { daDangKy: [], chuaDangKy: [] };

  try {
    const res = await fetch(
      `http://localhost:8080/academic/info/mon-dang-ky?khoaId=${selectedMajor}&kyHocId=${selectedSemester}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    const daDangKy = data.filter((item) => item.daDangKy === 1);
    const chuaDangKy = data.filter((item) => item.daDangKy === 0);
    return { daDangKy, chuaDangKy };
  } catch (err) {
    console.error("❌ Lỗi khi gọi API môn học:", err);
    throw err;
  }
};
