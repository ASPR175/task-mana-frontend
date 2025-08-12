"use client";

import { useEffect, useState } from "react";
import { createtask, getallmytasks, deletetasks } from "@/lib/task";
import ProtectedRoute from "@/components/ProtectedRoutes";
import toast, { Toaster } from "react-hot-toast";

type Task = {
  id: string;
  title: string;
  description: string;
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

const fetchTasks = async () => {
  setLoading(true);
  try {
    const res = await getallmytasks();
    setTasks(Array.isArray(res) ? res : []); // <-- force array
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
      await deletetasks(id);
      toast.success("Task deleted");
      fetchTasks();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete task");
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-4 max-w-lg mx-auto">
        <Toaster position="top-right" />
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

       
        <form onSubmit={handleCreate} className="mb-6 space-y-2">
          <input
            type="text"
            placeholder="Task title"
            className="border w-full p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Task description"
            className="border w-full p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            Create Task
          </button>
        </form>

        {/* Task List */}
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="border p-2 flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold">{task.title}</h2>
                  <p className="text-sm">{task.description}</p>
                </div>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-500 text-white px-3 py-1"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}



