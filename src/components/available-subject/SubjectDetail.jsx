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
export default function SubjectDetail({ details }) {
  if (!details) return <div>Đang tải...</div>;

  // Hàm xử lý khi chọn lớp học phần
  const handleSelect = (id) => {
    console.log("Lớp học phần được chọn:", id);
    // TODO: Gửi dữ liệu về server hoặc lưu vào state cha
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
