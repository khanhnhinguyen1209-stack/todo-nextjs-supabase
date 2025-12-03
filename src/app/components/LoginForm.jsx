"use client";

import { useState } from "react";

export default function LoginForm({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false); // Chuyển đổi giữa Login/Register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // Lấy danh sách user từ localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (isRegister) {
      // --- XỬ LÝ ĐĂNG KÝ ---
      const existingUser = users.find((u) => u.username === username);
      if (existingUser) {
        setError("Tên đăng nhập đã tồn tại!");
        return;
      }

      const newUser = { username, password };
      localStorage.setItem("users", JSON.stringify([...users, newUser]));
      alert("Đăng ký thành công! Hãy đăng nhập.");
      setIsRegister(false); // Chuyển về form đăng nhập
      setPassword("");
    } else {
      // --- XỬ LÝ ĐĂNG NHẬP ---
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        onLogin(user.username); // Đăng nhập thành công
      } else {
        setError("Sai tên đăng nhập hoặc mật khẩu!");
      }
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-20 bg-white p-8 rounded-2xl shadow-2xl">
      <h1 className="text-3xl font-bold text-center text-purple-600 mb-2">
        {isRegister ? "Đăng Ký Tài Khoản" : "Đăng Nhập"}
      </h1>
      <p className="text-gray-500 text-center mb-6">
        Quản lý công việc hiệu quả
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm text-center font-medium">
            ⚠️ {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên đăng nhập
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="Nhập tên của bạn"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-md"
        >
          {isRegister ? "Đăng Ký Ngay" : "Đăng Nhập"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        {isRegister ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
            setPassword("");
          }}
          className="font-bold text-purple-600 hover:underline"
        >
          {isRegister ? "Đăng nhập ngay" : "Đăng ký mới"}
        </button>
      </div>
    </div>
  );
}