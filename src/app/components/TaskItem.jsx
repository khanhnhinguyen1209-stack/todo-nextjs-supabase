"use client";

export default function TaskItem({ task, onToggle = () => {}, onEdit = () => {}, onDelete = () => {} }) {
  if (!task) return null;
  
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== "done"; // Kiểm tra quá hạn

  return (
    <div className={`p-4 rounded-xl border-2 ${task.status === "done" ? "bg-gray-50" : "bg-white"} border-gray-200`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={task.status === "done"}
            onChange={() => onToggle(task)}
            className="w-5 h-5 rounded cursor-pointer accent-purple-600"
          />
          <div>
            <h3 className={`${task.status === "done" ? "line-through text-gray-400" : "text-gray-800"}`}>
              {task.text}
            </h3>
            <p className={`text-sm ${isOverdue ? "text-red-600 font-semibold" : "text-gray-600"}`}>
              📅 Hạn: {new Date(task.deadline).toLocaleString("vi-VN")}
              {isOverdue && " (QUÁ HẠN)"}
            </p>
            {task.status === "done" && task.finishedTime && (
              <p className="text-sm text-green-600 mt-1">
                ✅ Hoàn thành: {new Date(task.finishedTime).toLocaleString("vi-VN")}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-gray-100 rounded"
            disabled={task.status === "done"}
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-50 rounded"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}