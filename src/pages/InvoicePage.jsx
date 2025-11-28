// src/pages/InvoicePage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function InvoicePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const sinhVienKhoaId = queryParams.get("sinhVienKhoaId");
  const kyHocId = queryParams.get("kyHocId");
  const token = sessionStorage.getItem("accessToken");

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sinhVienKhoaId || !kyHocId) return;

    fetch(
      `http://localhost:8036/payments/invoice?sinhVienKhoaId=${sinhVienKhoaId}&kyHocId=${kyHocId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setInvoice(data))
      .catch((err) => console.error("❌ Lỗi lấy hóa đơn:", err))
      .finally(() => setLoading(false));
  }, [sinhVienKhoaId, kyHocId, token]);

  if (loading) return <p>Đang tải hóa đơn...</p>;
  if (!invoice) return <p>Không tìm thấy hóa đơn.</p>;

  // const handleThanhToan = () => {
  //   fetch(`http://localhost:8036/payments/vn-pay?orderId=${invoice.id}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.data?.code === "ok" && data.data?.paymentUrl) {
  //         // ✅ Thành công → mở VNPay ở tab mới
  //         window.open(data.data.paymentUrl, "_blank");
  //       } else {
  //         alert(
  //           "Không thể khởi tạo thanh toán: " +
  //             (data.data?.message || "Lỗi không xác định")
  //         );
  //       }
  //     })
  //     .catch((err) => console.error("❌ Lỗi thanh toán:", err));
  // };
  // const handleThanhToan = () => {
  //   // Thay vì fetch → redirect trực tiếp
  //   const vnPayUrl = `http://localhost:8036/payments/vn-pay?orderId=${invoice.id}`;
  //   window.open(vnPayUrl, "_blank"); // Mở tab mới → BE redirect thẳng sang VNPAY
  // };

  const handleThanhToan = async () => {
    try {
      const res = await fetch(
        `http://localhost:8036/payments/vn-pay?orderId=${invoice.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log(`url: ${data.data.paymentUrl}`);
      if (data.data.paymentUrl) {
        // 👉 Redirect đúng link VNPAY
        const vnPayUrl = data.data.paymentUrl;
        window.open(vnPayUrl, "_blank");
        // Hoặc mở tab mới:
        // window.open(data.paymentUrl, "_blank");
      } else {
        alert("❌ Backend không trả về paymentUrl!");
      }
    } catch (err) {
      console.error("Lỗi thanh toán:", err);
      alert("⚠ Không thể khởi tạo thanh toán!");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "700px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center" }}>🧾 HÓA ĐƠN HỌC PHÍ</h2>
      <hr />

      <div style={{ marginBottom: "16px" }}>
        <p>
          <strong>Mã sinh viên:</strong> {invoice.maSinhVien || "—"}
        </p>
        <p>
          <strong>Tên sinh viên:</strong> {invoice.sinhVienTen || "—"}
        </p>
        <p>
          <strong>Khoa:</strong> {invoice.tenKhoa || "—"}
        </p>
        <p>
          <strong>Kỳ học:</strong> {invoice.tenKyHoc || "—"}
        </p>
        <p>
          <strong>Trạng thái:</strong>{" "}
          <span
            style={{
              color:
                invoice.status === "PAID"
                  ? "green"
                  : invoice.status === "FAILED"
                  ? "red"
                  : "orange",
              fontWeight: "bold",
            }}
          >
            {invoice.status}
          </span>
        </p>
        <p>
          <strong>Hạn thanh toán:</strong>{" "}
          {invoice.dueDate
            ? new Date(invoice.dueDate).toLocaleDateString()
            : "—"}
        </p>
        {invoice.paidAt && (
          <p>
            <strong>Thời gian thanh toán:</strong>{" "}
            {new Date(invoice.paidAt).toLocaleString()}
          </p>
        )}
      </div>

      <h3>📚 Danh sách môn học</h3>
      <ul>
        {invoice.items?.map((item, i) => (
          <li key={i} style={{ marginBottom: "4px" }}>
            {i + 1}. {item.tenMonHoc} ({item.credit} TC) —{" "}
            {item.amount.toLocaleString()} VNĐ
          </li>
        ))}
      </ul>

      <h2 style={{ textAlign: "right", marginTop: "16px" }}>
        Tổng cộng:{" "}
        <span style={{ color: "blue" }}>
          {invoice.totalAmount.toLocaleString()} VNĐ
        </span>
      </h2>

      {invoice.status !== "PAIDED" && (
        <button
          onClick={handleThanhToan}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "10px 0",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          💳 Thanh toán ngay
        </button>
      )}
    </div>
  );
}

export default InvoicePage;
