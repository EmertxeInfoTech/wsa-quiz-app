### New Concepts:

- User authentication and authorisation using `JWT`
- Random data selection from DB
- `aggregate` Mongoose query
- Import data from CSV/JSON into MongoDB via MongoDB Compass
- Handle 404 routes and generic errors

### API Documentation:

- Get questions for user

```
curl --location 'localhost:8000/v1/questions'
```

- Validate the user's answer

```
curl --location 'localhost:8000/v1/questions/validate-answer' \
--header 'Content-Type: application/json' \
--data '{
    "id": "656ad079a84fa0a39043bf49",
    "answer": {
        "id": 1,
        "value": "Narendra Modi"
    }
}'
```

- Register user

```
curl --location 'localhost:8000/v1/user/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "JD",
    "email": "jaydeep1012@gmail.com",
    "phone": "7276894525",
    "password": "jdpawar"
}'
```

- Login user

```
curl --location 'localhost:8000/v1/user/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "jaydeep1012@gmail.com",
    "password": "jdpawar"
}'
```