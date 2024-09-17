import { ValidationError } from 'class-validator';

export const validationErrorsMapper = {
  mapValidationErrorToValidationPipeErrorTArray: (errors: ValidationError[]) =>
    errors.flatMap(({ constraints, property: field }) =>
      Object.entries(constraints).map(([_, message]) => ({
        field,
        message,
      })),
    ),
};
