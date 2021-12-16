import { IStatus } from './interfaces';

export function composeError(
  message: string,
  st: Date,
  additionalData?: { [key: string]: any },
): IStatus {
  const et = new Date();
  const interval = et.getTime() - st.getTime();
  const intervalInSeconds = interval / 1000;
  return {
    status: 'error',
    message,
    metrics: {
      startTime: st.toUTCString(),
      endTime: et.toUTCString(),
      interval,
      intervalInSeconds,
    },
    ...additionalData,
  };
}

export function composeSuccess(
  message: string,
  st: Date,
  additionalData?: { [key: string]: any },
): IStatus {
  const et = new Date();
  const interval = et.getTime() - st.getTime();
  const intervalInSeconds = interval / 1000;
  return {
    status: 'success',
    message,
    metrics: {
      startTime: st.toUTCString(),
      endTime: et.toUTCString(),
      interval,
      intervalInSeconds,
    },
    ...additionalData,
  };
}
