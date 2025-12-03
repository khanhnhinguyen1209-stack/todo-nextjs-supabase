"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabase"; 
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import TaskList from "./components/TaskList";
import AddTaskForm from "./components/AddTaskForm";
import EditTaskModal from "./components/EditTaskModal";
import LoadingOverlay from "./components/LoadingOverlay";

export default function Home() {
  // --- PHẦN 1: LOGIC XỬ LÝ DỮ LIỆU (SUPABASE) ---
  const [session, setSession] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);

  // State bộ lọc và sắp xếp
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("deadline-asc");

  // 1. Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchTasks();
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchTasks();
      else setAllTasks([]);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Tải danh sách công việc từ Cloud
  const fetchTasks = async () => {
    setLoading(true);
    // Lấy task và sắp xếp theo ngày tạo mới nhất
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) setAllTasks(data);
    setLoading(false);
  };

  // 3. Thêm công việc mới
  const addTask = async (taskData) => {
    const newTask = {
      text: taskData.text,
      deadline: taskData.deadline,
      status: 'pending',
      user_id: session.user.id // Gán task cho người dùng hiện tại
    };
    
    const { data, error } = await supabase.from('tasks').insert([newTask]).select();
    
    if (!error && data) {
      setAllTasks(prev => [data[0], ...prev]);
    }
  };

  // 4. Cập nhật nội dung công việc
  const updateTask = async (updatedTask) => {
    const { error } = await supabase
      .from('tasks')
      .update({ 
        text: updatedTask.text, 
        deadline: updatedTask.deadline,
        status: updatedTask.status,
      })
      .eq('id', updatedTask.id);

    if (!error) {
      setAllTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    }
  };

  // 5. Xóa công việc
  const deleteTask = async (taskId) => {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (!error) {
      setAllTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  // 6. Đổi trạng thái (Hoàn thành / Chưa hoàn thành)
  const toggleTask = async (task) => {
    const newStatus = task.status === "done" ? "pending" : "done";
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', task.id);

    if (!error) {
      setAllTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    }
  };

  // 7. Logic Bộ lọc và Sắp xếp (Chạy ở máy khách cho nhanh)
  const processedTasks = useMemo(() => {
    if (!session) return [];
    let result = [...allTasks]; // Copy mảng để tránh lỗi readonly

    // Lọc theo từ khóa tìm kiếm
    if (searchQuery) {
      result = result.filter(t => t.text.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    // Lọc theo trạng thái
    const now = new Date();
    if (filterStatus === "pending") result = result.filter(t => t.status !== "done");
    else if (filterStatus === "done") result = result.filter(t => t.status === "done");
    else if (filterStatus === "overdue") result = result.filter(t => t.status !== "done" && new Date(t.deadline) < now);

    // Sắp xếp
    result.sort((a, b) => {
      switch (sortBy) {
        case "deadline-asc": return new Date(a.deadline) - new Date(b.deadline);
        case "deadline-desc": return new Date(b.deadline) - new Date(a.deadline);
        case "name-asc": return a.text.localeCompare(b.text, "vi");
        case "name-desc": return b.text.localeCompare(a.text, "vi");
        default: return 0;
      }
    });
    return result;
  }, [allTasks, session, searchQuery, filterStatus, sortBy]);


  // --- PHẦN 2: GIAO DIỆN NGƯỜI DÙNG (MÀU TÍM) ---
  
  if (loading && !session) return <LoadingOverlay />;

  // 1. Màn hình Đăng nhập (Login)
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#c084fc] to-[#6b21a8]">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-purple-700">Đăng Nhập</h1>
          <p className="text-center text-gray-500 mb-6">Quản lý công việc hiệu quả</p>
          
          {/* Form đăng nhập của Supabase */}
          <Auth 
            supabaseClient={supabase} 
            appearance={{ 
                theme: ThemeSupa,
                variables: {
                    default: {
                        colors: {
                            brand: '#7e22ce', // Màu tím chủ đạo
                            brandAccent: '#6b21a8',
                        }
                    }
                }
            }}
            // 👇 DANH SÁCH CÁC CỔNG ĐĂNG NHẬP (Thêm 'azure' vào đây nếu muốn dùng lại Microsoft)
            providers={['google', 'facebook']} 
            theme="default"
          />
        </div>
      </div>
    );
  }

  // 2. Màn hình chính (Dashboard)
  return (
    <div className="min-h-screen p-4 md:p-8 flex justify-center bg-gradient-to-br from-[#c084fc] to-[#6b21a8]">
        <div className="w-full max-w-4xl">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 text-white">
            <div>
              <h1 className="text-4xl font-bold mb-2">Danh Sách Công Việc</h1>
              <p className="text-purple-100 text-lg">
                Xin chào, <span className="font-bold">{session.user.email}</span> 👋
              </p>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="px-6 py-2.5 rounded-xl font-semibold text-white bg-purple-700 hover:bg-purple-800 transition-colors shadow-md border border-purple-500"
            >
              Đăng Xuất
            </button>
          </div>

          <div className="space-y-6">
            {/* Form Thêm Công Việc */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <AddTaskForm
                addTask={addTask}
                currentUser={session.user.id}
                primaryColor="#7e22ce" 
              />
            </div>

            {/* Khu vực Danh sách & Bộ lọc */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              
              {/* Thanh công cụ: Tìm kiếm - Lọc - Sắp xếp */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Tìm kiếm */}
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                  <input 
                    type="text" 
                    placeholder="Tìm công việc..." 
                    className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-shadow"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Lọc trạng thái */}
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none appearance-none bg-white cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">📝 Tất cả trạng thái</option>
                  <option value="pending">⏳ Đang thực hiện</option>
                  <option value="done">✅ Đã hoàn thành</option>
                  <option value="overdue">🚨 Đã quá hạn</option>
                </select>

                {/* Sắp xếp */}
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none appearance-none bg-white cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="deadline-asc">📅 Hạn: Gần nhất trước</option>
                  <option value="deadline-desc">📅 Hạn: Xa nhất trước</option>
                  <option value="name-asc">🔤 Tên: A - Z</option>
                  <option value="name-desc">🔤 Tên: Z - A</option>
                </select>
              </div>

              <h3 className="text-gray-500 font-medium mb-4 ml-1">
                 Danh sách công việc ({processedTasks.length})
              </h3>
              
              <TaskList
                allTasks={processedTasks} 
                currentUser={session.user.id}
                toggleTask={toggleTask}
                editTask={setEditingTask}
                deleteTask={deleteTask}
              />
            </div>
          </div>

          {/* Modal chỉnh sửa */}
          {editingTask && (
            <EditTaskModal
              task={editingTask}
              updateTask={updateTask}
              closeModal={() => setEditingTask(null)}
              primaryColor="#7e22ce"
            />
          )}
        </div>
    </div>
  );
}