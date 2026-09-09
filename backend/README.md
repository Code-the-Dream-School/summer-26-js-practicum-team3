# Backend Setup

Database connection and workflows. For coding conventions and the contribution
process, see the root [`CONTRIBUTING.md`](../CONTRIBUTING.md).

## Database

### First-time setup

1. Create a `.env` file in the `backend` folder.
2. Open the "EatzRecipes" project in https://console.neon.tech/.
3. Open "Branches" on the sidebar and select "dev_basic_tables".
4. Click the green "Connect" button and copy the connection string.
5. Paste the connection string into the `.env` file:

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
> npm run db:generate         # regenerates the client from the schema.prisma already updated via git pull
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
