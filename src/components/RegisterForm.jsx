import { useEffect, useState, useCallback } from "react";
import MajorSelector from "./MajorSelector";
import SemesterSelector from "./SemesterSelector";
import AvailableSubjectList from "./AvailableSubjectList";
import RegisteredSubjectList from "./RegisteredSubjectList";
import DangKyTamTable from "./dang_ky_tam/DangKyTamTable";
import { useWebSocket } from "./websocket/UseWebSocket";
import { fetchMonHoc } from "../service/academicService";
import { fetchDangKyTamList } from "../service/draftService";
import { useNavigate } from "react-router-dom";
function RegisterForm() {
  const navigate = useNavigate();
  const [majors, setMajors] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [registeredSubjects, setRegisteredSubjects] = useState([]);

  const [sinhVienKhoaId, setSinhVienKhoaId] = useState(0);
  const [kyHocId, setKyHocId] = useState(null);

  const [dangKyTamList, setDangKyTamList] = useState([]);

  const token = sessionStorage.getItem("accessToken");
  //socket.io
  const [notifications, setNotifications] = useState([]);
  // Lấy danh sách Khoa & Kỳ học

  // --- HÀM GỌI API MÔN HỌC ---
  const loadMonHoc = useCallback(async () => {
    console.log(
      `call load mon hoc with major: ${JSON.stringify(
        majors
      )} - ${JSON.stringify(semesters)}`
    );
    console.log(
      `call load mon hoc with ${JSON.stringify(
        selectedMajor
      )} - ${JSON.stringify(selectedSemester)}`
    );
    if (!token || !selectedMajor || !selectedSemester) return;
    try {
      const { daDangKy, chuaDangKy } = await fetchMonHoc(
        token,
        selectedMajor,
        selectedSemester
      );
      setRegisteredSubjects(daDangKy);
      setAvailableSubjects(chuaDangKy);
    } catch (err) {
      console.error("❌ Lỗi loadMonHoc:", err);
    }
  }, [token, selectedMajor, selectedSemester]);

  // --- HÀM GỌI API DANH SÁCH ĐĂNG KÝ TẠM ---
  const loadDangKyTam = useCallback(async () => {
    if (!token || !sinhVienKhoaId) return;
    try {
      const data = await fetchDangKyTamList(token, sinhVienKhoaId);
      setDangKyTamList(data);
    } catch (err) {
      console.error("❌ Lỗi loadDangKyTam:", err);
    }
  }, [token, sinhVienKhoaId]);

  useEffect(() => {
    console.log("run useEffect khoa-kyHoc");
    if (!token) return;

    fetch("http://localhost:8080/student/information/khoa-kyhoc", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMajors(data.khoaResponseList || []);
        setSemesters(data.kyHocResponseList || []);
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
    loadMonHoc();

    console.log("call api get mon-hoc and svk");
    //2. Gọi API lấy sinhVienKhoaId
    fetch(
      `http://localhost:8080/student/information/id/sinh-vien-khoa?khoaId=${selectedMajor}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const svkId = data;
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
    console.log("call-thong tin dang ky");
    if (!sinhVienKhoaId) return;

    fetchDangKyTamList();
  }, [sinhVienKhoaId, token]);

  const handleXacNhanDangKy = async () => {
    if (!sinhVienKhoaId) {
      alert("Thiếu thông tin sinh viên.");
      return;
    }
    try {
      const res = await fetch(
        "http://localhost:8080/registration/info/confirm-registration",
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
        loadMonHoc();
      } else {
        alert("❌ " + result.message);
      }
    } catch (err) {
      console.error("Lỗi xác nhận:", err);
      alert("❌ Lỗi hệ thống: " + err.message);
    }
  };
  useWebSocket(1, (msg) => {
    loadDangKyTam();
    loadMonHoc();
    console.log("📩 Notification:", msg);
    setNotifications((prev) => [...prev, msg]);
    alert(`📢 Cập nhật: ${msg.status}`);
  });

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
        <div>
          <button onClick={handleXacNhanDangKy} style={{ marginTop: "20px" }}>
            ✅ Xác nhận đăng ký chính thức
          </button>
          <div>
            {notifications.map((n, i) => (
              <p key={i}>📢 {n.status}</p>
            ))}
          </div>
        </div>
      )}

      <RegisteredSubjectList
        subjects={registeredSubjects}
        disabled={!sinhVienKhoaId || !kyHocId}
      />
      <button
        onClick={() =>
          navigate(
            `/invoice?sinhVienKhoaId=${sinhVienKhoaId}&kyHocId=${kyHocId}`
          )
        }
        style={{ marginLeft: "10px" }}
      >
        🧾 Xem hóa đơn
      </button>
    </div>
  );
}

export default RegisterForm;
