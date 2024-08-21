import { ApiPropertyOptions, ApiProperty } from '@nestjs/swagger';

export class BodyDto {
  constructor(properties: { [key: string]: ApiPropertyOptions }) {
    Object.keys(properties).forEach((key) => {
      Object.defineProperty(this, key, {
        writable: true,
        enumerable: true,
        configurable: true,
      });
      ApiProperty(properties[key])(this, key);
    });
  }
}
