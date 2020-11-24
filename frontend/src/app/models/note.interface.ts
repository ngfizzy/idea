import { Tag } from './tag.interface';

export interface Note {
  id?: number;
  title: string;
  content: string;
  tags?: Tag[];
}
