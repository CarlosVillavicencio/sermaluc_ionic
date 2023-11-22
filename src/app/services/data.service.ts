import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Task {
  id?: string;
  title: string;
  text: string;
  fechaYHora: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private firestore: Firestore
  ) { }

  getTasks(): Observable<Task[]> {
    const tasksRef = collection(this.firestore, 'tasks');
    return collectionData(tasksRef, { idField: 'id' }) as Observable<Task[]>;
  }

  getTaskById(id: string): Observable<Task> {
    const taskDocRef = doc(this.firestore, `tasks/${id}`);
    return docData(taskDocRef, { idField: 'id' }) as Observable<Task>;
  }

  addTask(task: Task) {
    const taskDocRef = collection(this.firestore, `tasks`);
    return addDoc(taskDocRef, task);
  }

  deleteTask(task: Task) {
    const taskDocRef = doc(this.firestore, `tasks/${task.id}`);
    return deleteDoc(taskDocRef);
  }

  updateTask(task: Task) {
    const taskDocRef = doc(this.firestore, `tasks/${task.id}`);
    return updateDoc(taskDocRef, { title: task.title, text: task.text, fechaYHora: task.fechaYHora });
  }
}
