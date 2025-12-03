"use client";
import { useState } from "react";

export default function AddTaskForm({ addTask, currentUser, primaryColor }) {
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text || !deadline) return;
    
    const newTask = {
      id: Date.now().toString(),
      text,
      deadline,
      status: "pending",
      userId: currentUser,
      createdAt: new Date().toISOString(),
    };
    
    addTask(newTask);
    setText("");
    setDeadline("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4" style={{ color: primaryColor }}>
        Thêm Công Việc Mới
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Nhập công việc cần làm"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
        style={{ background: primaryColor }}
      >
        Thêm Công Việc
      </button>
    </form>
  );
}