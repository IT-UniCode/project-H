import { v4 } from 'uuid';
export function generateSlug(title: string) {
  return title.toLowerCase().split(' ').join('-') + '-' + v4();
}
