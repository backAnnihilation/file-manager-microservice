import { ErrorsMessages } from '../../../core/utils/error-handler';

enum errors {
  title = 'title',
  name = 'name',
  login = 'login',
  shortDescription = 'shortDescription',
  description = 'description',
  blogId = 'blogId',
  content = 'content',
  postId = 'postId',
  email = 'email',
  loginOrEmail = 'loginOrEmail',
  websiteUrl = 'websiteUrl',
  password = 'password',
}

type ErrorsMessagesTypes = keyof typeof errors;

export const constructErrorMessages = (
  fields: ErrorsMessagesTypes[],
  message?: string,
) => {
  const errorsMessages: ErrorsMessages[] = [];
  for (const field of fields) {
    errorsMessages.push({
      message: message ?? expect.any(String),
      field: field ?? expect.any(String),
    });
  }
  return { errorsMessages };
};
