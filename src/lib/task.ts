import apiFetch from "@/lib/api"



export async function createtask(title:string,description:string) {
  return apiFetch("/api/task/createtask", {
    method: "POST",
    body: {title,description},
  });
}


export async function getallmytasks() {
  return apiFetch("/api/task/getall", {
    method: "POST",
  });
}

export async function deletetasks(id: string) {
  return apiFetch("/api/task/deletetask", {
    method: "POST",
    body: { task_id:id},
  });
}

