# Discord Bot Setup Guide

## Requirements

- **Discord Bot** with permissions to access:

  - `GatewayIntentBits.Guilds`
  - `GatewayIntentBits.GuildMessages`
  - `GatewayIntentBits.GuildMembers`
  - `GatewayIntentBits.MessageContent`

- **Environment Variables**:
  - `DATABASE_URL`: Your database connection URL
  - `DISCORD_BOT_TOKEN`: Your Discord bot token
  - `CHANNEL_ID`: The ID of the Discord channel where the bot will send messages
  - `GIPHY_API_KEY`: Your Giphy API key

### Example `.env` file:

```env
DATABASE_URL=your_database_url
DISCORD_BOT_TOKEN=your_discord_bot_token
CHANNEL_ID=your_discord_channel_id
GIPHY_API_KEY=your_giphy_api_key
```

## Setup Instructions

### 1. Install Dependencies

To install all the necessary dependencies, run:

```bash
npm install
```

### 2. To Start Bot

To run the tests for your project, use:

```bash
npm start
```

Wait for:

```bash
Bot is ready!
server is running at http://localhost:3000
```

### 3. To Test

To run the tests for your project, use:

```bash
npm run test
```

## API Endpoints for `/messages`

### 1. `GET /messages`

- **Description**: Retrieve all messages.
- **Response**: A list of all messages in the system.

### 2. `POST /messages`

- **Description**: Create a new message.

- **Request Body**:
  - `username`: The name of the user.
  - `sprintCode`: The code of the sprint.
- **Response**: The created message with status code `201`.

### 3. `GET /messages/username/:username`

- **Description**: Retrieve messages by a specific username.
- **Request Params**:
  - `username`: The username of the user.
- **Response**: A list of messages sent by the specified user.

### 4. `GET /messages/sprint/:sprint`

- **Description**: Retrieve messages by a specific sprint.
- **Request Params**:
  - `sprint`: The sprint code.
- **Response**: A list of messages associated with the specified sprint.

## API Endpoints for `/sprints`

### 1. `GET /sprints`

- **Description**: Retrieve all sprints.
- **Response**: A list of all sprints in the system.

### 2. `POST /sprints`

- **Description**: Create a new sprint.
- **Request Body**: The data for the sprint.
- **Response**: The created sprint with status code `201`.

### 3. `GET /sprints/:id`

- **Description**: Retrieve a specific sprint by its ID.
- **Request Params**:
  - `id`: The ID of the sprint.
- **Response**: The sprint associated with the specified ID.

### 4. `PATCH /sprints/:id`

- **Description**: Update an existing sprint by its ID.
- **Request Params**:
  - `id`: The ID of the sprint.
- **Request Body**: The updated data for the sprint.
- **Response**: The updated sprint.

## API Endpoints for `/templates`

### 1. `GET /templates`

- **Description**: Retrieve all templates.
- **Response**: A list of all templates in the system.

### 2. `POST /templates`

- **Description**: Create a new template.
- **Request Body**: The data for the template.
- **Response**: The created template with status code `201`.

### 3. `GET /templates/:id`

- **Description**: Retrieve a specific template by its ID.
- **Request Params**:
  - `id`: The ID of the template.
- **Response**: The template associated with the specified ID.

### 4. `PATCH /templates/:id`

- **Description**: Update an existing template by its ID.
- **Request Params**:
  - `id`: The ID of the template.
- **Request Body**: The updated data for the template.
- **Response**: The updated template.

### 5. `DELETE /templates/:id`

- **Description**: Delete a template by its ID.
- **Request Params**:
  - `id`: The ID of the template.
- **Response**: The deleted template.
