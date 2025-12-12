// TaskList.jsx (PHIÊN BẢN ĐÃ SỬA)
"use client";

import TaskItem from "./TaskItem";

export default function TaskList({
  allTasks = [], // Nhận danh sách đã được lọc/sắp xếp từ page.jsx
  toggleTask,
  editTask,
  deleteTask,
}) {
  return (
    <div className="space-y-3">
      {/* Hiển thị số lượng công việc */}
      <h3 className="text-gray-500 font-medium mb-4 ml-1">
         Danh sách công việc ({allTasks.length})
      </h3>
      
      {allTasks.length === 0 ? (
        <p className="text-center py-12 text-gray-400">
          Chưa có công việc nào
        </p>
      ) : (
        allTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            // Truyền các hàm tương tác xuống TaskItem
            onToggle={toggleTask}
            onEdit={() => editTask(task)}
            onDelete={() => deleteTask(task.id)}
          />
        ))
      )}
    </div>
  );
}