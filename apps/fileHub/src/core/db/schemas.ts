import {
  FileMeta,
  FileMetaSchema,
} from '../../features/profile/domain/entities/file-meta.schema';
import {
  PostFileMeta,
  PostFileMetaSchema,
} from '../../features/profile/domain/entities/post-file-meta.schema';

export const schemas = [
  {
    name: FileMeta.name,
    schema: FileMetaSchema,
  },
  {
    name: PostFileMeta.name,
    schema: PostFileMetaSchema,
  },
];
