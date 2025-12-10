"use client";

import { useEffect, useState } from "react";
import TaskItem from "./TaskItem";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/tasks", { cache: "no-store" });
        const data = await res.json();
        console.log("📥 Fetched tasks:", data);
        console.log("📊 Data type:", typeof data);
        console.log("📊 Is array:", Array.isArray(data));
        console.log("📊 Length:", data?.length);
        setTasks(Array.isArray(data) ? data : []);
      } catch (e) {
        console.log("Fetch error:", e);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h2 className="font-bold text-lg">
        Danh sách công việc ({tasks.length})
      </h2>

      {loading && <p>Đang tải...</p>}

      {!loading && tasks.length === 0 && (
        <p className="text-gray-500">Chưa có công việc nào</p>
      )}

      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
