# MBTI API

**MBTI API for integration with [devil.ai](https://devil.ai) API**

This API provides endpoints to query MBTI-related data and integrates seamlessly with the devil.ai platform.

---

## 🚀 Deployment

Follow these steps to deploy the API locally:

1. Clone this repository:
   ```bash
   git clone https://github.com/ESCORIAL-SAIC/mbti-api.git
   cd mbti-api
   ```

2. Copy and rename the environment file:
   ```bash
   cp .env.example .env
   ```

3. Fill in your own values in the `.env` file.

4. Install dependencies:
   ```bash
   npm install
   ```

5. Run the API:
   ```bash
   npm start
   ```

6. API documentation will be available at:
   ```
   http://localhost:<port>/api-docs
   ```

---

## Database Schema

The database schema is available in [schema.dbml](./schema.dbml) in [DBML](https://dbml.dev/) format.

You can visualize or export it using tools like:
- [dbdiagram.io](https://dbdiagram.io/home)
- [DBML CLI](https://github.com/holistics/dbml-cli)

### Tables Overview

- `Matches`
- `Predictions`
- `TestResults`
- `TraitOrder`

---

## 📦 Technologies Used

- Node.js
- Express.js
- Swagger for documentation
- dotenv for configuration management

---

## 📄 API Documentation

After starting the server, navigate to:
```
http://localhost:<port>/api-docs
```
You’ll find full Swagger-generated documentation of available endpoints.

---

## 📌 Example Usage

**POST /api/create-test**

Request:

```json
{
    "name": "string"
}
```

Response:

```json
{
  "test_id": "string",
  "test_url": "string"
}
```

**GET /api/get-test?name=name**

Response:

```json
{
  "data": {
    "test_url": "string",
    "prediction": "string",
    "predictions": {
      "INTP": "int",
      "ISTP": "int",
      "ENTJ": "int",
      "ISFP": "int",
      "ESTJ": "int",
      "INFP": "int",
      "ISFJ": "int",
      "INFJ": "int",
      "INTJ": "int",
      "ISTJ": "int",
      "ESFJ": "int",
      "ENFJ": "int",
      "ENTP": "int",
      "ESFP": "int",
      "ESTP": "int",
      "ENFP": "int"
    },
    "trait_order_conscious": {
      "hero": "string",
      "parent": "string",
      "child": "string",
      "inferior": "string"
    },
    "trait_order_shadow": {
      "nemesis": "string",
      "critic": "string",
      "trickster": "string",
      "demon": "string"
    },
    "matches": {
      "0": "Matching <a target=\"_blank\" href=\"https://devil.ai/INTP\" class=\"tag tag_t label_intp \" title=\"\">INTP</a> high conscious trait.",
      "1": "Matching <a target=\"_blank\" href=\"https://devil.ai/ENFJ\" class=\"tag tag_f label_enfj \" title=\"\">ENFJ</a> second highest conscious trait.",
      "2": "Matching <a target=\"_blank\" href=\"https://devil.ai/INFP\" class=\"tag tag_f label_infp \" title=\"\">INFP</a> second lowest conscious trait.",
      "3": "Matching <a target=\"_blank\" href=\"https://devil.ai/ENTJ\" class=\"tag tag_t label_entj \" title=\"\">ENTJ</a> lowest conscious trait.",
      "4": "Matching <a target=\"_blank\" href=\"https://devil.ai/INTP\" class=\"tag tag_t label_intp \" title=\"\">INTP</a> high unconscious trait.",
      "5": "Matching <a target=\"_blank\" href=\"https://devil.ai/ESFJ\" class=\"tag tag_f label_esfj \" title=\"\">ESFJ</a> second highest unconscious trait.",
      "6": "Matching <a target=\"_blank\" href=\"https://devil.ai/ISFP\" class=\"tag tag_f label_isfp \" title=\"\">ISFP</a> second lowest unconscious trait.",
      "7": "Matching <a target=\"_blank\" href=\"https://devil.ai/ENTJ\" class=\"tag tag_t label_entj \" title=\"\">ENTJ</a> lowest unconscious trait."
    },
    "test_id": "string",
    "result_date": "datetime",
    "results_page": "string"
  }
}
```

---

## 🛠️ Contributing

Contributions are welcome! Please open an issue or pull request if you want to add something or fix a bug.