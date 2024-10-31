import { StrapiImage } from 'src/types/types/previewImage';

type Format = 'small' | 'medium' | 'thumbnail';

export function getImageUrl(
  imgObject: StrapiImage,
  size: Format = 'small',
): string {
  return process.env.STRAPI_URL.split('/api')[0] + imgObject.formats[size].url;
}
