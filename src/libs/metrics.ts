import { Logger } from '@nestjs/common';

export function calculateTimeTaken(
  st: Date,
  logger: Logger,
  message?: string,
): void {
  const et = new Date();
  logger.log(`**************** ${message ?? 'Log'} ****************`);
  logger.log(`Start Time : ${st.toISOString()}`);
  logger.log(`  End Time : ${st.toISOString()}`);
  logger.log(
    `Total Time : ${(et.getTime() - st.getTime()) / 1000} (in Seconds)`,
  );
  logger.log(`**************** ${message ?? 'Log'} End ****************`);
}
