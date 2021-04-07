import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TagService } from '../../../services/tag.service';
import { Tag } from '../../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'ida-sidenav',
  templateUrl: 'sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Input() isLargeDevice: boolean;
  @Output() tagSelected = new EventEmitter<Tag>();

  tags$: Observable<Tag[]>;

  isExpanded: boolean;
  selectedTag: Tag;

  constructor(private tagService: TagService) {
    this.tags$ = this.tagService.tags$
   }

  ngOnInit() {}

  setSelectedTag(tag: Tag) {
    this.selectedTag = this.selectedTag?.id === tag.id ? null : tag;
    this.tagSelected.emit(this.selectedTag);
  }

}
