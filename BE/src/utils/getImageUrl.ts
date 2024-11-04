import { StrapiImage } from 'src/types/types/previewImage';

type Format = 'small' | 'medium' | 'thumbnail';

export function getImageUrl(
  imgObject: StrapiImage,
  size: Format = 'small',
): string {
  const imgEndpoint = imgObject?.formats[size]?.url || imgObject.url;

  return process.env.STRAPI_URL.split('/api')[0] + imgEndpoint;
}
