Telenet : project that is developed using Next.js. (https://nextjs.org/).

# ReactJS

React is an open-source JavaScript library used for building user interfaces and UI components.
# NextJS

Next.js is a popular open-source framework/extension built on top of React that is used for building server-rendered React applications and static websites.

# Web Application

Web application for handle different roles ( Admin, Staff & User ) & other responsibilities

# Structure
    .
    ├── public                  # Public contains fonts, layout -> images, locales, themes
    ├── src                     # Project's source code  
    │ ├── components            # Components used in the project    
    │ ├── helper                # Helper functions    
    │ ├── layout                # Project layout with configuration    
    │ ├── middleware            # Contains redux saga config    
    │ ├── pages                 # Contains all pages/file system routing information used in project   
    │ ├── _app.js           # Entry point of the application   
    ├── docs                    # Documentation files (alternatively `doc`)
    ├── src                     # Source files (alternatively `lib` or `app`)
    ├── test                    # Automated tests (alternatively `spec` or `tests`)
    ├── tools                   # Tools and utilities
    ├── LICENSE
    └── README.md

## Please follow the below steps

1. Clone the repository from git using the below command

```bash
git clone https://github.com/saravanan-nichi-in/telenet_hinanjo_web_fe_nextjs.git
```

2. Copy .env.local example -> .env.local & Update environments variables

3. Install packages from package.json

```bash
npm i
# or
npm install
```

If there is any obstruction in package installation, please check for Node version which supports Next.js.

## Development Mode

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with the browser to see the result.
If there is any obstruction in starting the node server, please check for Node version which supports Next.js.

## Production Mode

1. To generate the build run the below command

```bash
npm run build
```

2. Folder by name "out" will be created at the root level of the project directory.

3. Run "out" folder in local, Try

```bash
npx serve@latest out
```

4. Deploy the "out" folder as static export build in the server.

## Cypress Test

1. To Run the cypress

```bash
npm run cypress
```
