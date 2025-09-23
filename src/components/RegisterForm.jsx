import { useEffect, useState } from "react";
import MajorSelector from "./MajorSelector";
import SemesterSelector from "./SemesterSelector";
import AvailableSubjectList from "./AvailableSubjectList";
import RegisteredSubjectList from "./RegisteredSubjectList";

function RegisterForm() {
  const [majors, setMajors] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [registeredSubjects, setRegisteredSubjects] = useState([]);

  const [sinhVienKhoaId, setSinhVienKhoaId] = useState(null);
  const [kyHocId, setKyHocId] = useState(null);
  const token = sessionStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/api/sinh-vien/infomation/khoa-kyhoc", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMajors(data.khoaResponses || []);
        setSemesters(data.kyHocResponses || []);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thông tin:", err);
        alert(err.message);
      });
  }, [token]);

  useEffect(() => {
    if (!token || !selectedMajor || !selectedSemester) return;

    fetch(
      `http://localhost:8080/api/sinh-vien/infomation/mon-hoc/dang-ky?khoaId=${selectedMajor}&kyHocId=${selectedSemester}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const daDangKy = data.filter((item) => item.daDangKy === 1);
        const chuaDangKy = data.filter((item) => item.daDangKy === 0);
        setRegisteredSubjects(daDangKy);
        setAvailableSubjects(chuaDangKy);
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API:", err);
        alert(err.message);
      });
  }, [token, selectedMajor, selectedSemester]);

  return (
    <div>
      <h1>Đăng ký tín chỉ</h1>
      <MajorSelector
        majors={majors}
        selectedMajor={selectedMajor}
        onChange={setSelectedMajor}
      />
      <SemesterSelector
        semesters={semesters}
        selectedSemester={selectedSemester}
        onChange={setSelectedSemester}
      />
      <AvailableSubjectList subjects={availableSubjects} />
      <RegisteredSubjectList subjects={registeredSubjects} />
    </div>
  );
}

export default RegisterForm;
