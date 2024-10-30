interface ImgType {
  formats: { small: { url: string } };
}
export function getImageUrl(imgObject: ImgType): string {
  return process.env.STRAPI_URL + imgObject.formats.small.url;
}
