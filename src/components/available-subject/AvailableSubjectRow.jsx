import { useState } from "react";
import SubjectDetail from "./SubjectDetail";

function AvailableSubjectRow({
  subject,
  sinhVienKhoaId,
  kyHocId,
  setDangKyTamList,
}) {
  const [expanded, setExpanded] = useState(false);
  const [details, setDetails] = useState(null);

  const toggleRow = async () => {
    if (!expanded && !details) {
      // call API lấy chi tiết theo subject.id
      const token = sessionStorage.getItem("accessToken");
      const res = await fetch(
        `http://localhost:8080/schedule/info/lop-hoc?monHocKyHocId=${subject.monHocKyHocId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setDetails(data);
    }
    setExpanded((prev) => !prev);
  };

  return (
    <>
      <tr>
        <td>{subject.monHocKyHocId}</td>
        <td>{subject.tenMonHoc}</td>
        <td>{subject.soTinChi}</td>
        <td>
          <button onClick={toggleRow}>
            {expanded ? "▲ Thu gọn" : "▼ Xem chi tiết"}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={4}>
            <SubjectDetail
              details={details}
              sinhVienKhoaId={sinhVienKhoaId}
              kyHocId={kyHocId}
              setDangKyTamList={setDangKyTamList}
            />
          </td>
        </tr>
      )}
    </>
  );
}

export default AvailableSubjectRow;
