import React, { useContext } from "react";
import RegisterForm from "../components/RegisterForm";
import { AuthContext } from "../context/user/AuthContext";

function LoginSuccess() {
  const { user, logout } = useContext(AuthContext);
  return (
    <div style={{ padding: "20px" }}>
      <h1>🎓 Chào mừng bạn đến hệ thống đăng ký tín chỉ</h1>

      {/* Có thể thêm thông tin sinh viên ở đây */}
      <div>
        <strong>Tài khoản:</strong> {user.username}
      </div>

      {/* Component đăng ký môn học */}
      <RegisterForm />

      {/* Nút đăng xuất */}
      <button style={{ marginTop: "20px" }} onClick={logout}>
        Đăng xuất
      </button>
    </div>
  );
}

export default LoginSuccess;
