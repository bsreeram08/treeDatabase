<h1 align="center">
  Tree Database
</h1>
<p align="center">A Tree Database that uses FileTree and JSON as tree to create a relational database and handle rows as Array of inputs.</p>
<h3 align="center">
  Database
</h3>

## Create A Database

```bash
{
  name: string;
}

// Sample
{
	"name": "Surfboard"
}
```

## Delete A Database

```bash
{
  name: string;
}

// Sample
{
	"name": "Surfboard"
}
```

## Create Database with Tables

```bash
{
  name: string;
  tables: Tables;
}

Tables{
  name: string;
  entries: Entries[],
  database:{
    name:string;
  }
}

Entries{
  name: string;
  type: 'string' | 'boolean' | 'number' | 'timestamp' | 'JSON';
}

// Sample
{
	"name": "Surfboard",
	"tables": [
		{
			"name": "Employees",
			"entries": [
				{
					"name": "id",
					"type": "number"
				},
				{
					"name": "name",
					"type": "string"
				},
				{
					"name": "email",
					"type": "string"
				},
				{
					"name": "Salary",
					"type": "number"
				}
			],
			"database": {
				"name": "School"
			}
		}
	]
}
```


## Create Table

```bash
Tables{
  name: string;
  entries: Entries[],
  database: {
    name: string;
  }
}

Entries{
  name: string;
  type: 'string' | 'boolean' | 'number' | 'timestamp' | 'JSON';
}

// Sample
{
	"name": "hello234222",
	"entries": [
		{
			"name": "col1",
			"type": "string"
		}
	],
	"database": {
		"name": "hello3"
	}
}
```

##  Create Record in Table

```bash
{
  operation: 'create';
  database: {
    name: string;
  };
  table: {
    name: string;
  };
  query: {
    create: { [key: string]: any };
  };
}

// Sample
{
	"operation": "create",
	"database": {
		"name": "Surfboard"
	},
	"table": {
		"name": "Employees"
	},
	"query": {
		"create": {
			"id": 3,
			"name": "Sreeram 1",
			"email": "sreeram@gmail.com",
			"salary": 100
		}
	}
}
```

##  Read Record in Table

```bash
{
  operation: 'read';
  database: {
    name: string;
  };
  table: {
    name: string;
  };
  query: {
    select: { [key: string]: boolean };
    where: { [key: string]: any };
  };
}

// Sample
{
	"operation": "read",
	"database": {
		"name": "Surfboard"
	},
	"table": {
		"name": "Employees"
	},
	"query": {
		"select": {},   # If empty then select all
		"where": {}     # if empty then no condition
	}
}
```

##  Update Record in Table

```bash
{
  operation: 'update';
  database: {
    name: string;
  };
  table: {
    name: string;
  };
  query: {
    update: { [key: string]: any };
    where: { [key: string]: any };
  };
}

// Sample
{
	"operation": "update",
	"database": {
		"name": "Surfboard"
	},
	"table": {
		"name": "Employees"
	},
	"query": {
		"update": {
			"salary": 101
		},
		"where": {
			"id": 1
		}
	}
}

```

##  Delete Table

```bash
{
  name: string;
  database:{
    name: string;
  }
}

// Sample
{
	"name": "Employees",
	"database": {
		"name": "Surfboard"
	}
}

```

## Test

```bash
# unit tests
$ npm run test

```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Sreeram](bsreeram08@gmail.com)

## License
  Nest is [MIT licensed](LICENSE).
