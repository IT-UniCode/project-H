import { ApiProperty } from '@nestjs/swagger';

export class FundraisingPreview {
  @ApiProperty({
    description: 'Unique id of entity (changes after updating)',
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Unique id of entity (never changes)',
    type: String,
  })
  documentId: string;

  @ApiProperty({
    description: 'Date as string',
    example: '2024-10-22T13:40:49.782Z',
  })
  createdAt: string;

  @ApiProperty({
    example: 'Fundraiser Title',
    description: 'Title of the fundraiser',
  })
  title: string;

  @ApiProperty({
    example: 'Some text',
    description: 'Preview text for the fundraiser',
  })
  previewText: string;

  @ApiProperty({
    example: 'http://some.host.com/uploads/preview_image.jpeg',
    description: 'URL of the preview image',
  })
  previewImage: string;

  @ApiProperty({
    example: 'fundraiser-title',
    description: 'Slug for the fundraiser, used in URLs',
  })
  slug: string;
}
//     "previewText": "1234",
//     "slug": "1234",
//     "createdAt": "2024-11-04T12:33:23.476Z",
//     "fundraising_category": {
//       "id": 2,
//       "documentId": "s3lme3bmk1dcyy79sjr95so9",
//       "name": "1234",
//       "slug": "1234"
// }
//
// "id": 9,
//       "documentId": "dnlsao136v64grgwxfsf82d1",
//       "title": "1234",
//       "previewText": "1234",
//       "slug": "1234",
//       "createdAt": "2024-11-04T12:33:23.476Z",
//       "fundraising_category": {
//         "id": 2,
//         "documentId": "s3lme3bmk1dcyy79sjr95so9",
//         "name": "1234",
//         "slug": "1234"
//       },
//       "previewImage": "http://localhost:1337/uploads/small_google_efb2a5829a.jpg"
