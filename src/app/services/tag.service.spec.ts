import { TestBed, async, waitForAsync } from '@angular/core/testing';

import { TagService } from './tag.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { apiBaseUrl } from '../../env';
import { Tag, TagsResponse } from '../models';

describe('TagService', () => {
  let httpMock: HttpTestingController;
  let tagService: TagService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [TagService],
      imports: [ HttpClientTestingModule ]
    });

    tagService = TestBed.inject(TagService);
    httpMock = TestBed.inject(HttpTestingController);
  }));

  afterEach(waitForAsync(() => {
    httpMock.verify();
  }));

  it('should return all tags related to a note when a new tag is added', waitForAsync(() => {
    const tags = ['tag1', 'tag2'];
    const tagsResponse = { tags };
    const noteId = 1;

    tagService.tagNote('tag', noteId)
      .subscribe((noteTags) => {
        expect(noteTags).toEqual(tags);
      });

    const request = httpMock.expectOne(`${apiBaseUrl}/notes/tags/${noteId}`);

    expect(request.request.method.toLowerCase()).toEqual('put');
    expect(request.request.body).toEqual({ tag: 'tag'});

    request.flush(tagsResponse);
  }));

  it('can fetch all tags belonging to a note', waitForAsync(() => {
    const noteId = 1;
    const tags = ['tag1', 'tag2'];
    const tagsResponse = { tags };

    tagService.fetchNoteTags(noteId)
      .subscribe((noteTags) => {
        expect(noteTags).toEqual(tags);
      });

    const request = httpMock.expectOne(`${apiBaseUrl}/notes/tags/${noteId}`);

    expect(request.request.method.toLowerCase()).toEqual('get');

    request.flush(tagsResponse);
  }));

  it('should return a list of note tags that is left after a tag is deleted from a note', waitForAsync(() => {
      const noteId = 1;
      const tagId =  2;
      const tags = [{name: 'tag1'}, {name: 'tag 2'}] as Tag[];
      const tagsResponse: TagsResponse = { tags };

      tagService.removeTagFromNote(noteId, tagId)
        .subscribe((tagsLeft) => {
          expect(tagsLeft).toEqual(tags);
        });

      const request = httpMock.expectOne(`${apiBaseUrl}/notes/${noteId}/tags/${tagId}`);

      expect(request.request.method.toLowerCase()).toEqual('delete');

      request.flush(tagsResponse);
  }));

  it('can find in memory tags by name', () => {
    const tags: Tag[] = [
      { name: 'tag 1', id: 1},
      { name: 'tag 2', id: 2},
      { name: 'tag 3', id: 3},
      { name: 'tag 4', id: 4},
    ];

    const foundTag = tagService.findTagByName(tags, 'tag 3');

    expect(foundTag.name).toEqual('tag 3');
    expect(foundTag.id).toEqual(3);
  });

  it('can search for a tag belonging to a user', waitForAsync(() => {
    const tags: Tag[] = [
      { name: 'tag 1', id: 1},
      { name: 'tag 2', id: 2},
      { name: 'tag 3', id: 3},
      { name: 'tag 4', id: 4},
    ];

    const tagsResponse: TagsResponse = { tags };
    const searchTerm = 'tag';

    tagService.search(searchTerm)
      .subscribe((foundTags) => {
        expect(foundTags).toEqual(tags);
      });

    const request = httpMock.expectOne(`${apiBaseUrl}/tags/search?query=${searchTerm}`);

    expect(request.request.method.toLowerCase()).toEqual('get');

    request.flush(tagsResponse);
  }));
});
