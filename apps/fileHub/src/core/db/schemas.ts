import {
  PostImageMeta,
  PostImageMetaSchema,
} from '../../features/file/domain/entities/post-image-meta.schema';

export const schemas = [
  {
    name: PostImageMeta.name,
    schema: PostImageMetaSchema,
  },
];
