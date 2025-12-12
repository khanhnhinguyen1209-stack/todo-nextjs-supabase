"use client";
import { useState } from "react";

export default function EditTaskModal({ task, updateTask, closeModal, primaryColor }) {
  const [text, setText] = useState(task.text);
  const [deadline, setDeadline] = useState(
    task.deadline ? task.deadline.slice(0, 16) : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const isoDeadline = new Date(deadline).toISOString();

    updateTask({
      ...task,
      text,
      deadline: isoDeadline,
    });

    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>
          Chỉnh Sửa Công Việc
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            required
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 py-3 rounded-lg font-semibold border-2 border-purple-500 text-purple-500 hover:bg-purple-50"
            >
              Hủy
            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-lg font-semibold text-white hover:opacity-90"
              style={{ background: primaryColor }}
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
