export type ErrorsMessages = {
  message: string;
  field: string;
};

export type ErrorType = { errorsMessages: ErrorsMessages[] };

export enum ErrorField {
  Email = 'email',
  Code = 'code',
  Confirmation = 'confirmation',
  UserName = 'userName'
}

export const makeErrorsMessages = (msg: string): ErrorType => {
  const errorsMessages: Array<ErrorsMessages> = [];

  if (msg === ErrorField.Email) {
    errorsMessages.push({
      message: `User with this ${msg} is already registered`,
      field: `${msg}`,
    });
  }

  if (msg === ErrorField.Code) {
    errorsMessages.push({
      message: `incorrect confirmation ${msg}, please check entered data or request again`,
      field: `${msg}`,
    });
  }

  if (msg === ErrorField.Confirmation) {
    errorsMessages.push({
      message: `Email is already confirmed`,
      field: ErrorField.Confirmation,
    });
  }
  if (msg === ErrorField.UserName) {
    errorsMessages.push({
      message: `Username is already confirmed`,
      field: ErrorField.UserName,
    });
  }

  return { errorsMessages };
};
