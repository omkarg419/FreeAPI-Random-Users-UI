# FreeAPI Random Users UI

A React + Vite interface for browsing random users from the FreeAPI public endpoint. The app loads user data, renders profile-style cards, and shows a highlighted detail view for the selected user.

## Features

- Fetches users from the FreeAPI random users endpoint.
- Shows a responsive gallery of user cards.
- Includes a selected profile panel with key details.
- Supports client-side search by name, email, city, or country.
- Handles loading and error states.

## API Source

The app uses:

`https://api.freeapi.app/api/v1/public/randomusers`

The response shape used by the UI is:

- `payload.data.data`: array of user objects
- `payload.data.currentPage`: current page number
- `payload.data.totalPages`: total number of pages
- `payload.data.totalItems`: total number of users available
- `payload.data.currentPageItems`: number of users returned for the current page

Each user includes fields such as:

- `name.first`, `name.last`, `name.title`
- `email`
- `phone`
- `gender`
- `location.city`, `location.country`
- `picture.medium`, `picture.large`
- `login.username`
- `dob.age`

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Available Scripts

- `npm run dev` - start the Vite development server.
- `npm run build` - create a production build.
- `npm run preview` - preview the production build locally.
- `npm run lint` - run ESLint across the project.

## Project Structure

```text
src/
	App.jsx
	main.jsx
	index.css
```

