// TaskList.jsx
"use client";

import TaskItem from "./TaskItem";

export default function TaskList({ 
  allTasks, 
  currentUser, 
  toggleTask, 
  editTask, 
  deleteTask 
}) {
  const userTasks = allTasks.filter((t) => t.userId === currentUser); // Lọc công việc theo currentUser

  return (
    <div className="space-y-3">
      {userTasks.length === 0 ? (
        <p className="text-center py-12 text-gray-400">
          Chưa có công việc nào
        </p>
      ) : (
        userTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTask}
            onEdit={() => editTask(task)}
            onDelete={() => deleteTask(task.id)}
          />
        ))
      )}
    </div>
  );
}
