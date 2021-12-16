import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { environment } from './environment';

async function databaseBootstrap() {
  // Check if the database is available in the file system, if not then create the directory
  if (!fs.existsSync(environment.rootDatabaseDirectory))
    fs.mkdirSync(environment.rootDatabaseDirectory);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Database Server');
  await app.listen(environment.port, () => {
    logger.log(`Database Server Started at PORT : ${environment.port}`);
  });
}
databaseBootstrap().then(() => {
  bootstrap();
});

/**
 * A Database System that uses JSON as the Tree Structure with File Structure.
 * Root of the Tree is the Database Name Itself.
 * Followed by different databases that are created which are level 1 folders.
 * Followed by level 2 which are different tables in the databases as folders
 * Followed by columns metadata where each column is indexed in ascending order as a JSON file
 * Followed by entries in the column identified by entries in the form of an array as JSON file.
 */
