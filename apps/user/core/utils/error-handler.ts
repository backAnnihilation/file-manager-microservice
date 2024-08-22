export type ErrorsMessages = {
  message: string;
  field: string;
};

export type ErrorType = { errorsMessages: ErrorsMessages[] };

export const makeErrorsMessages = (msg: string): ErrorType => {
  const errorsMessages: Array<ErrorsMessages> = [];

  if (msg === 'email') {
    errorsMessages.push({
      message: `User with this ${msg} is already registered`,
      field: `${msg}`,
    });
  }

  if (msg === 'code') {
    errorsMessages.push({
      message: `incorrect confirmation ${msg}, please check entered data or request again`,
      field: `${msg}`,
    });
  }

  if (msg === 'confirmation') {
    errorsMessages.push({
      message: `Email is already confirmed or user doesn't exist`,
      field: `email`,
    });
  }

  if (msg === 'rateLimit') {
    errorsMessages.push({
      message: `Too Many Requests`,
      field: `rate limiting`,
    });
  }
  return { errorsMessages };
};
