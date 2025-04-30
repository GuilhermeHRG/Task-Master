import { db } from "./firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
  setDoc
} from "firebase/firestore";

// Tarefas (items)
export async function fetchTasks(uid: string) {
  const q = query(
    collection(db, "users", uid, "items"),
    orderBy("createdAt", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addTask(uid: string, data: { title: string; boardId: string }) {
  await addDoc(collection(db, "users", uid, "items"), {
    ...data,
    createdAt: serverTimestamp()
  });
}

export async function updateTask(uid: string, id: string, fields: Partial<{ title: string; boardId: string }>) {
  const ref = doc(db, "users", uid, "items", id);
  await updateDoc(ref, fields);
}

export async function deleteTask(uid: string, id: string) {
  const ref = doc(db, "users", uid, "items", id);
  await deleteDoc(ref);
}

// Estado do quadro Kanban (board)
export async function fetchBoardData(uid: string) {
  const ref = doc(db, "users", uid, "kanban", "board");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function saveBoardData(uid: string, data: any) {
  const ref = doc(db, "users", uid, "kanban", "board");
  await setDoc(ref, data);
}
