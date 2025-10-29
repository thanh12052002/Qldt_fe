import React from "react";

export default function DangKyTamTable({ dangKyTamList, onRemove }) {
  if (!dangKyTamList || dangKyTamList.length === 0) {
    return <p>📭 Chưa có lớp học phần nào được chọn.</p>;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>📚 Danh sách lớp học phần đã chọn tạm</h3>
      <table
        border="1"
        cellPadding={8}
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Tên môn học</th>
            <th>Số tín chỉ</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {dangKyTamList.map((item) => (
            <tr key={item.id}>
              <td>{item.tenMonHoc}</td>
              <td>{item.soTinChi}</td>
              <td>
                <button onClick={() => onRemove(item.id)}>❌ Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
