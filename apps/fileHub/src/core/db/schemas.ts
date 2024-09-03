import {
  FileMeta,
  FileMetaSchema,
} from '../../features/profile/domain/entities/file-meta.schema';

export const schemas = [
  {
    name: FileMeta.name,
    schema: FileMetaSchema,
  },
];
