"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TodoClient() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🔥 TodoClient mounted!");
    
    async function loadData() {
      try {
        console.log("🔍 Component mounted, loading tasks...");
        console.log("📍 Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
        
        // Try to fetch from "tasks" table
        const { data, error: supabaseError } = await supabase
          .from("tasks")
          .select("*");

        console.log("📦 Response from 'tasks':", { data, error: supabaseError });

        if (supabaseError) {
          console.error("❌ Error querying 'tasks':", supabaseError);
          // Try alternative table names
          const { data: data2, error: err2 } = await supabase
            .from("todos")
            .select("*");
          console.log("📦 Response from 'todos':", { data: data2, error: err2 });
          
          const { data: data3, error: err3 } = await supabase
            .from("task")
            .select("*");
          console.log("📦 Response from 'task':", { data: data3, error: err3 });
        }

        const finalData = data || [];
        console.log("✅ Final tasks loaded:", finalData);
        setTasks(finalData);
      } catch (err) {
        console.error("❌ Catch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Danh sách công việc ({tasks.length})</h1>
      <p style={{ color: "blue" }}>Debug: Loading={String(loading)}, Error={error}</p>

      {loading && <div style={{ color: "green" }}>⏳ Đang tải...</div>}
      {error && <div style={{ color: "red" }}>❌ Lỗi: {error}</div>}

      {!loading && !error && tasks.length === 0 && (
        <p style={{ color: "gray" }}>Chưa có công việc nào</p>
      )}
      
      {!loading && !error && tasks.length > 0 && (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{ padding: "8px", border: "1px solid #ccc", margin: "5px 0" }}>
              <strong>{task.title || task.text}</strong><br/>
              {JSON.stringify(task)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
