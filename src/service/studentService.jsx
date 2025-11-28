export const fetchMajorAndSemester = async (token) => {
  if (!token) {
    return;
  }
  //function
  try {
    const response = await fetch(
      "http://localhost:8080/student/information/khoa-kyhoc",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return {
      khoaResponseList: data.khoaResponseList || [],
      kyHocResponseList: data.kyHocResponseList || [],
    };
  } catch (err) {
    console.error("Lỗi khi lấy thông tin:", err);
    throw err;
  }
};

export const fetchSinhVienKhoaAndKyHoc = async (token, selectedMajor) => {
  if (!token || !selectedMajor) {
    return;
  }
  //fetch
  try {
    const response = await fetch(
      `http://localhost:8080/student/information/id/sinh-vien-khoa?khoaId=${selectedMajor}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return { svkId: data };
  } catch (err) {
    console.error("Error fetch api: ", err);
    throw err;
  }
};
