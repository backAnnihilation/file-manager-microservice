import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { FileType } from '@shared/models/file.models';

import {
  FileExtractedType,
  FileFormatType,
} from '../../api/models/input-models/extracted-file-types';

export type FileInputType = FileType & FileFormatType;

@Injectable()
export class FileExtractPipe implements PipeTransform {
  transform(
    file: FileInputType,
    metadata: ArgumentMetadata,
  ): FileExtractedType {
    if (!file) {
      throw new Error('No file provided');
    }

    const {
      destination,
      fieldname,
      path,
      stream,
      encoding,
      filename,
      ...fileCharacters
    } = file;

    return fileCharacters as FileExtractedType;
  }
}
