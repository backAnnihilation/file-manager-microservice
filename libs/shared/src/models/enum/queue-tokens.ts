export enum QUEUE_TOKEN {
  FILES_QUEUE = 'FILES_SERVICE',
  NOTICE_QUEUE = 'NOTICE_SERVICE',
}
export enum QUEUE_NAME {
  FILES = 'FILES',
  NOTICE = 'NOTICE',
}

export const FILES_SERVICE = QUEUE_NAME.FILES;

export enum EVENT_NAME {
  FILE_UPLOAD = 'upload_file',
  PHOTO_UPLOAD = 'upload_photo',
  VIDEO_UPLOAD = 'upload_video',
}
export const enum EVENT_COMMANDS {
  FILE_UPLOAD = 'FILE_UPLOAD',
  PHOTO_UPLOAD = 'PHOTO_UPLOAD',
}

export type CommandMap = {
  [key in EVENT_COMMANDS]: { cmd: EVENT_NAME };
};

export const EVENT_CMD: CommandMap = {
  [EVENT_COMMANDS.FILE_UPLOAD]: { cmd: EVENT_NAME.FILE_UPLOAD },
  [EVENT_COMMANDS.PHOTO_UPLOAD]: { cmd: EVENT_NAME.PHOTO_UPLOAD },
};

export const UPLOAD_PHOTO = EVENT_CMD[EVENT_COMMANDS.PHOTO_UPLOAD];
export const UPLOAD_FILE = EVENT_CMD[EVENT_COMMANDS.FILE_UPLOAD];
