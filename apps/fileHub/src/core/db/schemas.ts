import { BaseImageMeta } from '../../features/file/domain/entities/base-image-meta.schema';
import {
  PostImageMeta,
  PostImageMetaSchema,
} from '../../features/file/domain/entities/post-image-meta.schema';
import { ProfileImageMeta } from '../../features/file/domain/entities/user-profile-image-meta.schema';

export const schemas = [
  {
    name: PostImageMeta.name,
    schema: PostImageMetaSchema,
  },
  {
    name: ProfileImageMeta.name,
    schema: ProfileImageMeta,
  },
  {
    name: BaseImageMeta.name,
    schema: BaseImageMeta,
  },
];
