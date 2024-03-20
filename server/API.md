## API Documentation

### Tech Stack:

- Backend: Express.js
- Database: MySQL (https://aiven.io/)
- Caching: Redis (https://aiven.io/)

### API Endpoints:

1. Submit Code Snippet -
   ```http
   POST /api/snippets
   ```

#### Request Body

| Parameter     | Data type | Description                                                |
| :------------ | :-------- | :--------------------------------------------------------- |
| `username`    | `string`  | **Required**. Username of code submitter                   |
| `language`    | `string`  | **Required**. Programming language of code snippet         |
| `stdin`       | `string`  | **Required**. Standard input of the code snippet execution |
| `source_code` | `string`  | **Required**. Source code of code snippet                  |

#### Response Body

| Parameter    | Data type | Description                                 |
| :----------- | :-------- | :------------------------------------------ |
| `message`    | `string`  | Success of error message                    |
| `snippet_id` | `string`  | Unique Identifier for the submitted snippet |

2. Get All Code Snippets -
   ```http
   Get /api/snippets
   ```

#### Response Body

| Parameter       | Data type          | Description                                        |
| :-------------- | :----------------- | :------------------------------------------------- |
| `total`         | `number`           | Number of code snippets                            |
| `currentPage`   | `number`           | Current Page Number                                |
| `hasNextPage`   | `boolean`          | If any next page available                         |
| `hasPrevPage`   | `boolean`          | If any previous page available                     |
| `nextPage`      | `number`           | Page Number of next page                           |
| `limit`         | `number`           | Number of results in one page                      |
| `snippets`      | `Array of Objects` | Array containing details of all submitted snippets |
| `- username`    | `string`           | Username of the code submitter                     |
| `- language`    | `string`           | Programming language of code snippet               |
| `- stdin`       | `string`           | Standard input for the code execution              |
| `- source_code` | `string`           | Source code                                        |
| `- timestamp`   | `string`           | Timestamp of code snippet submission               |

