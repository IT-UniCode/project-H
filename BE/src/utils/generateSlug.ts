export function generateSlug(title: string, userName: string) {
  return userName + '-' + title.toLowerCase().split(' ').join('-');
}
