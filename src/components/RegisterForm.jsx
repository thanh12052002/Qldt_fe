import { useEffect, useState } from "react";
import MajorSelector from "./MajorSelector";
import SemesterSelector from "./SemesterSelector";
import AvailableSubjectList from "./AvailableSubjectList";
import RegisteredSubjectList from "./RegisteredSubjectList";
import DangKyTamTable from "./dang_ky_tam/DangKyTamTable";

function RegisterForm() {
  const [majors, setMajors] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [registeredSubjects, setRegisteredSubjects] = useState([]);

  const [sinhVienKhoaId, setSinhVienKhoaId] = useState(null);
  const [kyHocId, setKyHocId] = useState(null);

  const [dangKyTamList, setDangKyTamList] = useState([]);

  const token = sessionStorage.getItem("accessToken");

  // Lấy danh sách Khoa & Kỳ học
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/api/sinh-vien/information/khoa-kyhoc", {
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

  // Reset khi chọn lại Khoa hoặc Kỳ học
  useEffect(() => {
    setSinhVienKhoaId(null);
    setKyHocId(null);
    sessionStorage.removeItem("sinhVienKhoaId");
    sessionStorage.removeItem("kyHocId");
  }, [selectedMajor, selectedSemester]);

  const handleXoaLopHocPhan = (lopHocPhanId) => {
    setDangKyTamList((prev) =>
      prev.filter((item) => item.lopHocPhanId !== lopHocPhanId)
    );
  };

  // Gọi API lấy môn học + lấy sinhVienKhoaId sau khi chọn
  useEffect(() => {
    if (!token || !selectedMajor || !selectedSemester) return;

    // 1. Gọi API lấy môn học
    fetch(
      `http://localhost:8080/api/sinh-vien/information/mon-hoc/dang-ky?khoaId=${selectedMajor}&kyHocId=${selectedSemester}`,
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
        console.error("Lỗi khi gọi API môn học:", err);
        alert(err.message);
      });

    // 2. Gọi API lấy sinhVienKhoaId
    fetch(
      `http://localhost:8080/api/sinh-vien/information/sinh-vien-khoa?khoaId=${selectedMajor}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const svkId = data.id;
        setSinhVienKhoaId(svkId);
        setKyHocId(selectedSemester);

        sessionStorage.setItem("sinhVienKhoaId", svkId);
        sessionStorage.setItem("kyHocId", selectedSemester);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy sinhVienKhoaId:", err);
        alert(err.message);
      });
  }, [token, selectedMajor, selectedSemester]);

  //get all dang ky tam
  useEffect(() => {
    if (!sinhVienKhoaId) return;

    const fetchDangKyTamList = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/dang-ky-tam/danh-sach?sinhVienKhoaId=${sinhVienKhoaId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        setDangKyTamList(data); // danh sách DangKyTamDto[]
      } catch (err) {
        console.error("Lỗi khi gọi API danh sách đăng ký tạm:", err);
        alert("❌ Không thể tải danh sách đăng ký tạm");
      }
    };

    fetchDangKyTamList();
  }, [sinhVienKhoaId, token]);

  const handleXacNhanDangKy = async () => {
    if (!sinhVienKhoaId) {
      alert("Thiếu thông tin sinh viên.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8080/api/dang-ky-mon/xac-nhan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sinhVienKhoaId }),
        }
      );

      const result = await res.json();

      if (result.status) {
        alert("✅ " + result.message);
        setDangKyTamList([]); // reset sau khi xác nhận thành công
        // TODO: Có thể gọi lại API load lại danh sách đã đăng ký chính thức
      } else {
        alert("❌ " + result.message);
      }
    } catch (err) {
      console.error("Lỗi xác nhận:", err);
      alert("❌ Lỗi hệ thống: " + err.message);
    }
  };

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

      {/* Có thể disable nếu chưa chọn đủ */}
      <AvailableSubjectList
        subjects={availableSubjects}
        sinhVienKhoaId={sinhVienKhoaId}
        kyHocId={kyHocId}
        setDangKyTamList={setDangKyTamList}
        disabled={!sinhVienKhoaId || !kyHocId}
      />

      <DangKyTamTable
        dangKyTamList={dangKyTamList}
        onRemove={handleXoaLopHocPhan}
      />
      {dangKyTamList.length > 0 && (
        <button onClick={handleXacNhanDangKy} style={{ marginTop: "20px" }}>
          ✅ Xác nhận đăng ký chính thức
        </button>
      )}

      <RegisteredSubjectList
        subjects={registeredSubjects}
        disabled={!sinhVienKhoaId || !kyHocId}
      />
    </div>
  );
}

export default RegisterForm;
