"use client";

import { useEffect, useState } from "react";
import { createtask, getallmytasks, deletetasks } from "@/lib/task";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoutes";
import toast, { Toaster } from "react-hot-toast";


type Task = {
  id: string;
  title: string;
  description: string;
};

type ApiTask = {
  ID: string;
  Title: string;
  Description: string;
};


export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
 const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
 const setToken = useAuthStore((state)=>state.setToken)
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router, mounted]);



const fetchTasks = async () => {
  setLoading(true);
  try {
    const res: ApiTask[] = await getallmytasks();  
     console.log("Brother, here’s the raw tasks from backend:", res);
    setTasks(
     (res ?? []).map((t: ApiTask)=> ({
        id: t.ID,
        title: t.Title,
        description: t.Description,
      }))
    );
  } catch (err) {
    console.error(err);
    toast.error("Failed to load tasks");
    setTasks([]);
  }
  setLoading(false);
};


  useEffect(() => {
    fetchTasks();
  }, []);


  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    try {
      await createtask(title, description);
      setTitle("");
      setDescription("");
      toast.success("Task created successfully!");
      fetchTasks();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create task");
    }
  };

  const handleDelete = async (id: string) => {
    try {
        console.log("Deleting task with id:", id);
      await deletetasks(id);
      toast.success("Task deleted");
      fetchTasks();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete task");
    }
  };

const handleLogout = () => {
  setToken("");              
  localStorage.removeItem("token"); 
  router.push("/login");     
  toast.success("Logged out successfully!");
};


    if (!mounted) {
    return <p>Loading...</p>; 
  }

  if (!isAuthenticated) {
    return null; 
  }

  return (
 <ProtectedRoute>
      <div className="min-h-screen bg-base-200/60">
        <Toaster position="top-right" />

       
        <div className="sticky top-0 z-20 backdrop-blur">
          <div className="navbar rounded-none bg-gradient-to-r from-primary via-secondary to-accent text-primary-content shadow-md">
            <div className="flex-1">
              <span className="btn btn-ghost text-2xl font-extrabold tracking-tight">
                <span className="mr-2">📋</span> TaskMaster
              </span>
            </div>
            <div className="flex-none gap-2">
              <button onClick={handleLogout} className="btn btn-error btn-sm">
                Logout
              </button>
            </div>
          </div>
        </div>

        
        <div className="max-w-5xl mx-auto px-4 py-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {/* <div className="card bg-base-100 shadow-md border border-base-300/50 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200">
              <div className="card-body">
                <div className="text-sm opacity-70">Total</div>
                <div className="card-title text-3xl">{tasks.length}</div>
              </div>
            </div> */}
            <div className="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-md hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200">
              <div className="card-body">
                <div className="text-sm opacity-90">Active</div>
                <div className="card-title text-3xl">{tasks.length}</div>
              </div>
            </div>
            {/* <div className="card bg-base-100 shadow-md border border-base-300/50 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200">
              <div className="card-body">
                <div className="text-sm opacity-70">Completed</div>
                <div className="card-title text-3xl">0</div>
              </div>
            </div> */}
          </div>

         
          <div className="card bg-base-100 shadow-xl border border-base-300/50 mb-8">
            <div className="card-body">
              <h2 className="card-title">Create a new task</h2>
              <form onSubmit={handleCreate} className="grid gap-4">
                <input
                  type="text"
                  placeholder="Task title"
                  className="input input-bordered w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  placeholder="Task description"
                  className="textarea textarea-bordered w-full min-h-28"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="flex items-center gap-3">
                  <button type="submit" className="btn btn-primary">
                    Create Task
                  </button>
                  <span className="text-xs opacity-70">
                    Pro tip: keep titles short & punchy.
                  </span>
                </div>
              </form>
            </div>
          </div>

          
          {loading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-ring loading-lg" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="mockup-window border bg-base-100 shadow">
              <div className="px-6 py-12 flex flex-col items-center justify-center gap-3">
                <span className="text-5xl">🗒️</span>
                <h3 className="text-lg font-semibold">No tasks yet</h3>
                <p className="opacity-70 text-center">
                  Create your first task using the form above.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="group card bg-base-100 shadow-md border border-base-300/50 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
                >
                  <div className="card-body">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="card-title text-lg">{task.title}</h3>
                        <p className="opacity-80">{task.description}</p>
                      </div>
                      <button
                        className="btn btn-error btn-sm group-hover:scale-105 transition"
                        onClick={() => handleDelete(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="badge badge-outline">Personal</div>
                      <div className="badge badge-outline">Active</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>

  );
}



