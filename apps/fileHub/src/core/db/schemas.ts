import {
  FileMeta,
  FileMetaSchema,
} from '../../features/file/domain/entities/file-meta.schema';

export const schemas = [
  {
    name: FileMeta.name,
    schema: FileMetaSchema,
  },
];
