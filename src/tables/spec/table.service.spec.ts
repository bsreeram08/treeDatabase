import { Test, TestingModule } from '@nestjs/testing';
import { TablesService } from '../tables.service';
import { TablesModule } from '../tables.module';

describe('Table Service', () => {
  let service: TablesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TablesService],
      imports: [TablesModule],
    }).compile();

    service = module.get<TablesService>(TablesService);
  });

  it('Database Service - should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Create Table', () => {
    expect(
      service.createTable({
        name: 'hello',
        entries: [
          {
            name: 'col1',
            type: 'string',
          },
        ],
        database: {
          name: 'hello',
        },
      }),
    ).toStrictEqual({
      status: 'success',
      message: 'Table Created Successfully.',
    });
  });

  it('Create Same Table', () => {
    expect(
      service.createTable({
        name: 'hello',
        entries: [
          {
            name: 'col1',
            type: 'string',
          },
        ],
        database: {
          name: 'hello',
        },
      }),
    ).toStrictEqual({
      status: 'error',
      message: 'Table could not be created.',
    });
  });

  it('Delete Table', () => {
    expect(
      service.deleteTable({
        name: 'hello',
        database: {
          name: 'hello',
        },
      }),
    ).toStrictEqual({
      status: 'success',
      message: 'Table deleted Successfully.',
    });
  });

  it('Delete Same Table', () => {
    expect(
      service.deleteTable({
        name: 'hello',
        database: {
          name: 'hello',
        },
      }),
    ).toStrictEqual({
      status: 'error',
      message: 'Table could not be deleted.',
    });
  });

  it('Create Query Table', () => {
    expect(
      service.create({
        operation: 'create',
        database: {
          name: 'School',
        },
        table: {
          name: 'Students',
        },
        query: {
          select: {},
          create: {
            id: 4,
            name: 'Sreeram 1',
            email: 'sreeram@gmail.com',
            marks: 1001,
          },
          update: {},
          where: {},
        },
      }),
    ).toStrictEqual({
      status: 'success',
      message: 'Data Created Successfully',
    });
  });
  it('Update Query Table', () => {
    expect(
      service.updateData({
        operation: 'update',
        database: {
          name: 'School',
        },
        table: {
          name: 'Students',
        },
        query: {
          select: {},
          create: {},
          update: {
            id: 1,
            name: 'Sreeram',
            email: 'sreeram@gmail.com',
            marks: 200,
          },
          where: {
            id: 1,
          },
        },
      }),
    ).toStrictEqual({
      status: 'success',
      message: 'Data Updated Successfully',
    });
  });
  it('Read Query Table', () => {
    expect(
      service.readData({
        operation: 'read',
        database: {
          name: 'School',
        },
        table: {
          name: 'Students',
        },
        query: {
          select: {},
          create: {},
          update: {},
          where: {
            id: 1,
          },
        },
      }),
    ).toStrictEqual({
      status: 'success',
      message: 'Query read successfully.',
      data: {
        read: [
          {
            id: 1,
            name: 'Sreeram',
            email: 'sreeram@gmail.com',
            marks: 200,
          },
          {
            id: 1,
            name: 'Sreeram',
            email: 'sreeram@gmail.com',
            marks: 200,
          },
        ],
      },
    });
  });
});
