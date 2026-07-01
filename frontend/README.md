# <img src="./public/logo.svg" alt="logo" width="25" height="25"> MoorTube - Frontend

This is a thorough guide for those eager to contribute to the MoorTube UI/UX.

## 👷‍♂️ Architecture
```text
├── /public                 # Static assets (images and logo)
├── /src                    # The source folder that contains all React code
|   ├── /api                # Axios custom API
|   ├── /assets
|   |   ├── /fonts          # The Roboto font assets used for the UI
|   ├── /components         # All the reusable React components
|   |   ├── /UI             # Components that are used on loading state
|   ├── /pages              # Pages that constitute the different parts of the app
|   |   ├── /404            # Not found page UI
|   |   ├── /auth           # The login and sign up page
|   |   ├── /disc           # The saved videos page
|   |   ├── /home           # The home page UI
|   |   └── /watch          # The watch page that hosts video player and prayer times panel
|   ├── /types              # The frontend types
|   ├── /utils              # Helper functions
|   ├── App.tsx
|   ├── global.d.ts
|   ├── index.scss
|   ├── main.tsx
|   └── vite-env.d.ts
├── .env
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.js