import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SourceComponent } from './source.component';
import { PodcastComponent } from './podcast.component';
import { SystemComponent } from './system.component';

const routes: Routes = [
  {path: '', redirectTo: '/source', pathMatch: 'full'},
  {path: 'source', component: SourceComponent},
  {path: 'mypodcast', component: PodcastComponent},
  {path: 'system', component: SystemComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
