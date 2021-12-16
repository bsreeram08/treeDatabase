import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database.service';
import { DatabaseModule } from '../database.module';

describe('Database Service', () => {
  let service: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService],
      imports: [DatabaseModule],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it('Database Service - should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Create Database', () => {
    expect(service.createDatabase({ name: 'helloWorld' })).toStrictEqual({
      status: 'success',
      message: 'Created Database Successfully.',
    });
  });

  it('Create Same Database', () => {
    expect(service.createDatabase({ name: 'helloWorld' })).toStrictEqual({
      status: 'error',
      message: 'Could not create the database.',
    });
  });

  it('Delete Database', () => {
    expect(service.deleteDatabase({ name: 'helloWorld' })).toStrictEqual({
      status: 'success',
      message: 'Deleted Database Successfully.',
    });
  });

  it('Delete Same Database', () => {
    expect(service.deleteDatabase({ name: 'helloWorld' })).toStrictEqual({
      status: 'error',
      message: 'Could not delete the database.',
    });
  });
});
