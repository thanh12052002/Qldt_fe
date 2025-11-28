import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export const useWebSocket = (studentId, onMessageReceived) => {
  const stompClient = useRef(null);

  useEffect(() => {
    if (!studentId) return;

    const socket = new SockJS("http://localhost:8087/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // Tự reconnect
      onConnect: () => {
        console.log("✅ Connected to WebSocket");

        // Đăng ký lắng nghe topic của sinh viên
        client.subscribe(
          `/topic/registration-status/${studentId}`,
          (message) => {
            onMessageReceived();
          }
        );

        // Gửi thử message (chỉ để test)
        client.publish({
          destination: "/app/message",
          body: JSON.stringify({ content: "Hello from client!" }),
        });
      },
      onStompError: (frame) => console.error("❌ STOMP error:", frame),
      onWebSocketError: (err) => console.error("❌ WebSocket error:", err),
      onDisconnect: () => console.log("🔌 Disconnected"),
      debug: (str) => console.log(str),
    });

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
      console.log("🧹 Cleanup WebSocket");
    };
  }, [studentId, onMessageReceived]);

  return stompClient;
};
