### New Concepts:

- How to use middleware in `express`
- How to attach data to `req` object and use it throughout the code
- Update MongoDB document using positional `$` operator
- Use `insertMany` to insert document into MongoDB
- Introducing `default` value for the mongoose model
- Introducing `enum` for mongoose model
- Using `constants` from other files to query MongoDB
- Using `.methods` to add custom method to mongoose schema

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
    },
    "updateQuestionStatus": true
}'
```