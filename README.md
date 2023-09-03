# Grammar Correction Bot

This application corrects the grammar of provided sentences using OpenAI's GPT-3 API and stores them in a SQLite database.

## Setup

1. Clone the repository.
2. Install the required npm packages using `npm install`.
3. Start the server using `npm start`.

Open the browser and navigate to `http://localhost:3000/index.html` to use the application.

## Endpoints

- `POST /corrections`: Accepts a sentence and returns the corrected version. Also stores both versions in the database.
- `GET /corrections`: Retrieves all correction pairs from the database.
- `GET /random`: Retrieves a random correction pair from the database.
