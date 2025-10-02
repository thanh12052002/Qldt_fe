import AvailableSubjectRow from "./available-subject/AvailableSubjectRow";

function AvailableSubjectList({
  subjects,
  sinhVienKhoaId,
  kyHocId,
  setDangKyTamList,
}) {
  if (!subjects || subjects.length === 0) return null;

  return (
    <div>
      <h2>📌 Môn học chưa đăng ký</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên môn học</th>
            <th>Số tín chỉ</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((s) => (
            <AvailableSubjectRow
              key={s.id}
              subject={s}
              sinhVienKhoaId={sinhVienKhoaId}
              kyHocId={kyHocId}
              setDangKyTamList={setDangKyTamList}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AvailableSubjectList;
