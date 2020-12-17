import { Component, Input, OnInit } from '@angular/core';
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

  tags$: Observable<Tag[]>;

  isExpanded: boolean;
  selectedTag: Tag;

  constructor(private tagService: TagService) {
    this.tags$ = this.tagService.getUserTags();
   }

  ngOnInit() {}

  setSelectedTag(tag: Tag) {
    this.selectedTag = tag;
  }

}
