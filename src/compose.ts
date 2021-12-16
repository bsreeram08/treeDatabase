import { IStatus } from './interfaces';

export function composeError(
  message: string,
  additionalData?: { [key: string]: any },
): IStatus {
  return {
    status: 'error',
    message,
    ...additionalData,
  };
}

export function composeSuccess(
  message: string,
  additionalData?: { [key: string]: any },
): IStatus {
  return {
    status: 'success',
    message,
    ...additionalData,
  };
}
