function RegisteredSubjectList({ subjects }) {
  if (subjects.length === 0) return null;

  return (
    <div>
      <h2>✅ Môn học đã đăng ký</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên môn học</th>
            <th>Số tín chỉ</th>
            <th>Trạng thái đăng ký</th>
            <th>Thời gian đăng ký</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((s, index) => (
            <tr key={index}>
              <td>{s.monHocId}</td>
              <td>{s.tenMonHoc}</td>
              <td>{s.soTinChi}</td>
              <td>{s.status}</td>
              <td>
                {s.thoiGianDangKy
                  ? new Date(s.thoiGianDangKy).toLocaleString()
                  : "Không rõ"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RegisteredSubjectList;
