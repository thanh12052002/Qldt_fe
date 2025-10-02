import React from "react";

// Hàm hiển thị lịch học dạng text
function TimetableText({ thoiGianLichHoc }) {
  if (!thoiGianLichHoc) return null;

  return (
    <div>
      {Object.entries(thoiGianLichHoc).map(([tuan, cacThu]) => (
        <div key={tuan}>
          <strong>Tuần {tuan}:</strong>
          <ul>
            {Object.entries(cacThu).map(([thu, info]) => (
              <li key={thu}>
                Thứ {thu} - Tiết {info.kips.join(", ")} - {info.tenPhongHoc}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Component chính hiển thị danh sách lớp học phần
export default function SubjectDetail({
  details,
  sinhVienKhoaId,
  setDangKyTamList,
}) {
  if (!details) return <div>Đang tải...</div>;

  // Hàm xử lý khi chọn lớp học phần
  const handleSelect = async (lopHocPhanId) => {
    if (!sinhVienKhoaId || !lopHocPhanId) {
      alert("Thiếu thông tin sinh viên hoặc lớp học phần.");
      return;
    }

    const payload = {
      sinhVienKhoaId,
      lopHocPhanId,
    };

    try {
      const res = await fetch(
        "http://localhost:8080/api/dang-ky-tam/them-moi",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await res.json();

      if (result.status) {
        alert("✅ " + result.message); // Ví dụ: Đăng ký tạm thành công
        // TODO: gọi lại API cập nhật danh sách đã đăng ký nếu cần
        if (result.thongTinDangKy) {
          setDangKyTamList((prev) => [...prev, result.thongTinDangKy]);
        }
      } else {
        alert("❌ " + result.message); // Ví dụ: Trùng lịch, hết slot...
      }
    } catch (err) {
      console.error("Lỗi gọi API:", err);
      alert("❌ Lỗi hệ thống: " + err.message);
    }
  };

  return (
    <div style={{ padding: "10px", background: "#f9f9f9" }}>
      <table
        border="1"
        cellPadding={8}
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Tên lớp học phần</th>
            <th>Sĩ số tối đa</th>
            <th>Còn lại</th>
            <th>Thời khóa biểu</th>
            <th>Chọn</th>
          </tr>
        </thead>
        <tbody>
          {details.map((lhp) => (
            <tr key={lhp.id}>
              <td>{lhp.ten}</td>
              <td>{lhp.siSoToiDa}</td>
              <td>{lhp.siSoToiDa - lhp.siSoDangKy}</td>
              <td>
                <TimetableText thoiGianLichHoc={lhp.thoiGianLichHoc} />
              </td>
              <td>
                <button onClick={() => handleSelect(lhp.id)}>Chọn</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
