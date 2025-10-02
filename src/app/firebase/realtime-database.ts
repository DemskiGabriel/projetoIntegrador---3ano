import { Injectable, inject } from '@angular/core';
import { Database, ref, list, set, onValue, remove, update } from '@angular/fire/database';
import { firstValueFrom, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealtimeDatabaseService {

  constructor(
    private db: Database = inject(Database)
  ) { }

  ref(url: string){
    return ref(this.db, url);
  }

  list(url: string){
    return list(this.ref(url));
  }

  add(url: string, data: any, id:number = 0){
    return from(
      (async () => {
        let indice = 1;
        const snapshot: any = await firstValueFrom(this.list(url));

        if(snapshot !== undefined){
          indice = snapshot.length + 1;
        }

        const url_indice = id == 0 ? indice:id;
        const url_full = `${url}/${url_indice}`;
        const ref = this.ref(url_full);

        await set(ref, data);

        return url_indice;
      })()
    );
  }

  query(url: string, callback: any){
    return onValue(this.ref(url), callback);
  }

  remove(url:string){
    return remove(this.ref(url));
  }

  update(path: string, data: any): Promise<void> {
    const dbRef = this.ref(path);
    return update(dbRef, data);
  }
}