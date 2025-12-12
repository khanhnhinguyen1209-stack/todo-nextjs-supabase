"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  useUser, 
  SignedIn, 
  SignedOut, 
  SignInButton,
  SignUpButton,
  UserButton,
  ClerkLoaded
} from "@clerk/nextjs";

import TaskList from "./components/TaskList";
import AddTaskForm from "./components/AddTaskForm";
import EditTaskModal from "./components/EditTaskModal";
import LoadingOverlay from "./components/LoadingOverlay";

export default function Home() {
  const { user, isLoaded, isSignedIn } = useUser();

  // Tên hiển thị
  const displayName = useMemo(() => {
    if (!user) return "Người dùng";
    
    // Ưu tiên các loại tên
    if (user.fullName) return user.fullName;
    if (user.firstName) return user.firstName;
    if (user.username) return user.username;
    if (user.primaryEmailAddress?.emailAddress) {
      return user.primaryEmailAddress.emailAddress;
    }
    if (user.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress;
    }
    
    return "Người dùng";
  }, [user]);

  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);

  // Bộ lọc
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("deadline-asc");

  // Reset loading khi auth state thay đổi
  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => setLoading(false), 500);
    }
  }, [isLoaded, isSignedIn]);

  // Load tasks từ localStorage khi user đã đăng nhập
  useEffect(() => {
    if (user && isSignedIn) {
      const savedTasks = localStorage.getItem(`tasks_${user.id}`);
      if (savedTasks) {
        try {
          setAllTasks(JSON.parse(savedTasks));
        } catch (error) {
          console.error("Error parsing tasks:", error);
          setAllTasks([]);
        }
      }
    }
  }, [user, isSignedIn]);

  // ADD TASK
  const addTask = async (taskData) => {
    if (!user) return;
    
    const newTask = {
      id: Date.now().toString(),
      text: taskData.text,
      deadline: taskData.deadline,
      status: "pending",
      user_id: user.id,
      created_at: new Date().toISOString(),
    };

    const updatedTasks = [newTask, ...allTasks];
    setAllTasks(updatedTasks);
    
    localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedTasks));
  };

  // UPDATE TASK
  const updateTask = async (updatedTask) => {
    const updatedTasks = allTasks.map((t) =>
      t.id === updatedTask.id ? updatedTask : t
    );
    setAllTasks(updatedTasks);
    
    if (user) {
      localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedTasks));
    }
  };

  // DELETE TASK
  const deleteTask = async (taskId) => {
    const updatedTasks = allTasks.filter((t) => t.id !== taskId);
    setAllTasks(updatedTasks);
    
    if (user) {
      localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedTasks));
    }
  };

  // TOGGLE TASK
  const toggleTask = async (task) => {
    const newStatus = task.status === "done" ? "pending" : "done";
    
    const updatedTask = {
      ...task,
      status: newStatus,
      finishedTime: newStatus === "done" ? new Date().toISOString() : null,
    };

    const updatedTasks = allTasks.map((t) =>
      t.id === task.id ? updatedTask : t
    );
    setAllTasks(updatedTasks);
    
    if (user) {
      localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedTasks));
    }
  };

  // FILTER + SEARCH + SORT
  const processedTasks = useMemo(() => {
    if (!user || !isSignedIn) return [];

    let result = [...allTasks];

    // 🔎 search
    if (searchQuery) {
      result = result.filter((t) =>
        t.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 🎯 filter
    const now = new Date();
    if (filterStatus === "pending")
      result = result.filter((t) => t.status !== "done");
    else if (filterStatus === "done")
      result = result.filter((t) => t.status === "done");
    else if (filterStatus === "overdue")
      result = result.filter(
        (t) => t.status !== "done" && new Date(t.deadline) < now
      );

    // ↕ sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "deadline-asc":
          return new Date(a.deadline) - new Date(b.deadline);
        case "deadline-desc":
          return new Date(b.deadline) - new Date(a.deadline);
        case "name-asc":
          return a.text.localeCompare(b.text);
        case "name-desc":
          return b.text.localeCompare(a.text);
        default:
          return 0;
      }
    });

    return result;
  }, [allTasks, searchQuery, filterStatus, sortBy, user, isSignedIn]);

  // ====================================================
  // UI - LOADING
  // ====================================================
  if (!isLoaded || loading) {
    return <LoadingOverlay />;
  }

  return (
    <ClerkLoaded>
      <>
        <SignedOut>
          <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#c084fc] to-[#6b21a8]">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
              <h1 className="text-3xl font-bold text-purple-700 mb-6">Đăng nhập để tiếp tục</h1>
              <p className="text-gray-600 mb-6">Quản lý công việc hiệu quả với Task Manager</p>
              <SignInButton mode="modal">
                <button className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl font-semibold w-full transition-colors">
                  Đăng nhập với Clerk
                </button>
              </SignInButton>
              <div className="mt-4">
                <SignUpButton mode="modal">
                  <button className="text-purple-600 hover:text-purple-800 font-medium">
                    Chưa có tài khoản? Đăng ký ngay
                  </button>
                </SignUpButton>
              </div>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="min-h-screen p-4 md:p-8 flex justify-center bg-gradient-to-br from-[#c084fc] to-[#6b21a8]">
            <div className="w-full max-w-4xl">
              {/* HEADER */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 text-white">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Danh Sách Công Việc</h1>
                  <p className="text-purple-100 text-lg">
                    Xin chào, <span className="font-bold">
                      {displayName}
                    </span> 👋
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>

              <div className="space-y-6">
                {/* FORM THÊM TASK */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                  <AddTaskForm addTask={addTask} currentUser={user?.id} primaryColor="#7e22ce" />
                </div>

                {/* DANH SÁCH TASK */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                  {/* TOOLBAR */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <input
                      type="text"
                      placeholder="Tìm công việc..."
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <select
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">📝 Tất cả</option>
                      <option value="pending">⏳ Chưa xong</option>
                      <option value="done">✅ Hoàn thành</option>
                      <option value="overdue">🚨 Trễ hạn</option>
                    </select>

                    <select
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="deadline-asc">📅 Gần nhất</option>
                      <option value="deadline-desc">📅 Xa nhất</option>
                      <option value="name-asc">🔤 A → Z</option>
                      <option value="name-desc">🔤 Z → A</option>
                    </select>
                  </div>

                  <TaskList
                    allTasks={processedTasks}
                    toggleTask={toggleTask}
                    editTask={setEditingTask}
                    deleteTask={deleteTask}
                  />
                </div>
              </div>

              {/* MODAL CHỈNH SỬA */}
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
        </SignedIn>
      </>
    </ClerkLoaded>
  );
}