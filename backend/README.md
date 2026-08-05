# Backend Setup

## Database 

### First-time setup 

1. Create a `.env` file in the `backend` folder.
2. Open the "EatzRecipes" project in https://console.neon.tech/.
3. Open "Branches" on the sidebar and select "dev_basic_tables".
4. Click the green "Connect" button and copy the connection string.
5. Paste the connection string into the `.env.` file:

```
DATABASE_URL="postgresql://your_connection_string_here"
```

6. From either the root or `backend` directory, run the following commands to pull
   the latest schema and generate your Prisma client.

```bash
> npm run db:pull
> npm run db:generate
```

### Already set up, just staying current
```bash
> git pull origin main
> npm ci                      # only if package.json/lock changed
> npm run db:generate         # regenerates the client from the schema.prisma already updated via git pul
```
`db:pull` is not required here - the person who changed the DB should already have pulled and committed the updated schema.prisma. Relaunching is safe if you want to double-check the connection.

### Making database changes

If you need to change the database structure (add a column, a table, etc.), the change happens directly in Neon — we don't use Prisma Migrate. Once you've made the change:

1. Run the following command from the `root` folder to pull the new structure into `schema.prisma`.
```bash
> npm run db:pull
```
2. Run the following command to regenerate the Prisma client.
```bash
> npm run db:generate
```
3. Commit the updated `schema.prisma` and open a PR, so the rest of the team stays in sync.

### Testing against a local database instead of Neon

1. Complete first-time setup

Follow First-time setup Scenario if you haven't already — npm ci, init-env, db:pull, db:generate against Neon.

2. Set up a local Postgres database

Install Postgres and create an empty local database.

3. Point the app at your local database

 - Open the .env file in backend/.

 - Leave DATABASE_URL (the Neon string) exactly as it is - this is our source of truth and you never edit or comment it out.

 - Add two new lines at the bottom:

```bash
> LOCAL_DATABASE_URL=postgresql://<your-mac-username>@localhost:5432/my_local_db
> DB_TARGET=local
```
- Save the file.

`DB_TARGET=local` is the only switch - flipping it doesn't require touching your Neon connection string at all.

4. Verify the connection, then push the schema

 - Open your terminal and navigate into the project, then into the backend folder. 

 - If you're not sure where you are, run pwd - the output should end in .../backend.

 - Do not run db pull here - it would overwrite schema.prisma with your local database's structure, corrupting the file that's supposed to always reflect Neon.

- Check the resolved connection with zero side effects instead:

```bash
> node -e "require('node:process').loadEnvFile(); console.log(process.env.DB_TARGET === 'local' ? process.env.LOCAL_DATABASE_URL : process.env.DATABASE_URL)"
```

This only prints the string - nothing is touched.

- Once confirmed, push the schema and generate the client (from backend/):

```bash
> npx prisma db push       # creates the tables in your local database from schema.prisma
> npm run db:generate      # regenerates the Prisma client
> npx prisma studio        # optional, opens a browser UI to view/edit your local data
```
5. Run the app locally

```bash
> npm run dev
```
Your app now reads and writes to your local database. Test freely - nothing here touches Neon.

6. Switch back to the remote (Neon) database

Comment out the single `DB_TARGET=local` line in .env (leave `LOCAL_DATABASE_URL` there for next time if you want). That's it - `DATABASE_URL` was never touched, so the app immediately goes back to Neon on the next restart.


# Best Practices & Security Guide

This document outlines **backend API, security, and architecture best practices** for a Node.js + Express application.
It is written for students building their first **real-world backend** and should be used as a reference while developing features.

## 🎯 Core Responsibilities of the Backend

The backend API is responsible for:

- Defining API routes
- Validating incoming data
- Applying business rules
- Interacting with the database
- Enforcing security and access control

The backend **must not**:

- Render UI
- Trust client input
- Expose sensitive information

## 🧱 API Architecture Best Practices

### 1️⃣ Separate Routes from Controllers

**Routes**

- Define the URL and HTTP method

**Controllers**

- Contain the logic for handling requests

This separation keeps code readable and scalable.

### 2️⃣ One Responsibility per File

If a file:

- defines routes
- validates data
- accesses the database
- formats responses

…it is doing too much.

Break logic into smaller, focused files.

### 3️⃣ Use Async/Await in Controllers

Controllers should be predictable and readable:

```js
const getItems = async (req, res, next) => {
  try {
    res.json({ data: [] });
  } catch (error) {
    next(error);
  }
};
```

## ❌ Input Validation & Trust Boundaries

### 4️⃣ Never Trust Client Input

All data coming from:

- request bodies
- query params
- URL params

must be validated.

Even simple checks help prevent bugs and attacks.

### 5️⃣ Validate Early, Fail Fast

Reject invalid requests immediately with a `400` response.
Do not allow bad data to reach business logic or the database.

## 🧯 Error Handling Best Practices

### 6️⃣ Centralized Error Handling

Use a single error-handling middleware:

```js
module.exports = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || 'Server error',
  });
};
```

Benefits:

- consistent responses
- easier debugging
- cleaner controllers

---

### 7️⃣ Never Leak Internal Errors

❌ Bad:

```json
{ "error": "Cannot read property 'map' of undefined" }
```

✅ Good:

```json
{ "message": "Something went wrong" }
```

Log details on the server, not in API responses.

## 🔐 Security Best Practices

### 8️⃣ Use Security Middleware

Recommended packages:

- `helmet` – secure HTTP headers
- `cors` – control cross-origin access
- `express-rate-limit` – prevent abuse
- `morgan` – request logging

These should be applied **globally**.

### 9️⃣ Principle of Least Privilege

- Only expose necessary routes
- Never return sensitive fields (passwords, secrets)
- Protect routes that modify data

### 🔟 Use Environment Variables for Secrets

Examples:

- database URLs
- JWT secrets
- API keys

Never commit `.env` files to Git.

## 🌐 API Design Best Practices

### 1️⃣1️⃣ Use Proper HTTP Status Codes

- `200` – success
- `201` – resource created
- `400` – bad request
- `401` – unauthorized
- `403` – forbidden
- `404` – not found
- `500` – server error

### 1️⃣2️⃣ Keep API Response Shapes Consistent

Example success response:

```json
{
  "success": true,
  "data": {}
}
```

Example error response:

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

Consistency makes frontend development easier.

## 🗄 Database Best Practices

- Only the backend talks to the database
- Keep database logic out of routes
- Never expose database errors directly to clients

## 🧠 Recommended Mindset

> The backend is the **source of truth** for data, rules, and security.

Build APIs assuming:

- clients can be buggy
- clients can be malicious
- future developers will read your code

## 📋 Quick Checklist (Before MVP Review)

- [ ] Routes and controllers are separated
- [ ] Input is validated
- [ ] Errors are handled centrally
- [ ] Security middleware is enabled
- [ ] Secrets are stored in environment variables
- [ ] API responses are consistent

## 📄 License

Educational use only.
