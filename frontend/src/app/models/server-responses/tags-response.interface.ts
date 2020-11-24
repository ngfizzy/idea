import { Tag } from '..';

export interface TagsResponse {
    tags: Tag[] | {};
}

export interface PlainTagsResponse {
    tags: string[] | {};
}
