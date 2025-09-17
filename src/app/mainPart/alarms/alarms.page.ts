import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonAvatar, IonNote, IonLabel, IonToggle } from '@ionic/angular/standalone';
import { RealtimeDatabaseService } from '../../firebase/realtime-database';

@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.page.html',
  styleUrls: ['./alarms.page.scss'],
  standalone: true,
  imports: [ IonToggle, IonLabel, IonNote, IonAvatar,  IonItem, IonContent, CommonModule, FormsModule ]
})
export class AlarmsPage implements OnInit {
  public dados:Array<any> = [];

  constructor(
    public rt:RealtimeDatabaseService
  ) { }

  ngOnInit() {
  }

  load(){
    this.rt.query('/newsletter', (snapshot:any) => {
      if(snapshot.val() !== null){
        this.dados = Object(snapshot.val()).
        map((item:any,key:number) => {
          item.id = key;
          return item;
        }).filter((item:any) => item != null);
      }else{
        this.dados = [];
      }
    });
  }

  excluir(id:number){
    this.rt.remove(`/newsletter/${id}`).then();
  }
}
