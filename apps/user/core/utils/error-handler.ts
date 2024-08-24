export type ErrorsMessages = {
  message: string;
  field: string;
};

export type ErrorType = { errorsMessages: ErrorsMessages[] };

export enum ErrorField {
  Email = 'email',
  Code = 'code',
  Confirmation = 'confirmation',
  UserName = 'userName',
  Title = 'title',
  Name = 'name',
  Login = 'login',
  ShortDescription = 'shortDescription',
  Description = 'description',
  BlogId = 'blogId',
  Content = 'content',
  PostId = 'postId',
  LoginOrEmail = 'loginOrEmail',
  WebsiteUrl = 'websiteUrl',
  Password = 'password',
}

export type ErrorsMessagesTypes = keyof typeof ErrorField;

export const makeErrorsMessages = (invalidField: ErrorField): ErrorType => {
  const errorsMessages: Array<ErrorsMessages> = [];

  if (invalidField === ErrorField.Email) {
    errorsMessages.push({
      message: `User with this ${invalidField} is already registered or doesn't exist`,
      field: `${invalidField}`,
    });
  }

  if (invalidField === ErrorField.Code) {
    errorsMessages.push({
      message: `incorrect confirmation ${invalidField}, please check entered data or request again`,
      field: `${invalidField}`,
    });
  }

  if (invalidField === ErrorField.Confirmation) {
    errorsMessages.push({
      message: `Email is already confirmed`,
      field: ErrorField.Confirmation,
    });
  }
  if (invalidField === ErrorField.UserName) {
    errorsMessages.push({
      message: `Username is already confirmed`,
      field: ErrorField.UserName,
    });
  }

  return { errorsMessages };
};
