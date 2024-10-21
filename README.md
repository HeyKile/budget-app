# Budget Beater - The Budgeting Web App by [HeyKile](https://github.com/HeyKile)

## Description
Budget Beater is a web application allowing users to create spending categories, log purchases within said categories, and manage their spending over time. Written in React and Python, this web app provides a easy way for users to manage their money.

## Setup

### 0. Dependencies
- To run Budget Beater, the following dependencies are required:
    - [Python 3](https://www.python.org/downloads/): For the backend API
    - [Python Venv](https://docs.python.org/3/library/venv.html): For easy management of Python packages
    - [Node.js](https://nodejs.org/en/download/package-manager): For React package management
- As well, this was devleoped using [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install), so setup on a windows machine will likely differ!

### 1. Installing Dependencies
- For convenience, setup has been compiled into a bash script (`setup.sh`)
- This script will: 
    - create the venv for the Python API
    - install the required Python packeges
    - install the node modules for the front end
- To run the script, first compile with `chmod +x setup.sh`
- Then, execute the script with `./setup.sh`

- Once the script has completed, then active the virtual environment with `source /budget-app-api/venv/bin/activate`
- Note: to leave the virtual environment, simply run `deactivate`

### 2. Setting Up The Front End
- TBD: going to make the setup process seamless...

## Development
While my schooling and personal projects have thought me basic DOM manipulation and other reactive web frameworks, this project was my first time working with React. Thus far, I can see why React is so widely used, being fairly easy to pick-up and understand. Overall, it made the front-end development experience straight-forward, and I did not struggle on learning the syntax and basic rules.

The backend API was a different story for me. Originally, I had written the backend in Rust using Axum. With experience in Haskell and an appreciation for C, felt trying Rust would be a fun challenge. However, Rust for web development prooved to be more of a burden for me, as trying to make simple changes became a difficult challenge. After struggling to create custom middleware to allow my React front end to interact with my Axum API, I made the tough decision to rewrite my API in Python using Flask.

*It was the best decision I made.*

After switching to Python, I made massive progress, getting to nearly the same point I was at with my Rust code in just 3 hours. From there, building the API was a breeze, and manging authentication with JSON Web Tokens (JWTs) made the process so simple. And while Python isn't the fastest and my code needs improvement, the progress I was able to make made the switch from Rust worth it for me.

And P.S., I really like Rust, I just didn't like the complexity and the hoops I had to jump through to get things working. This was especially frustrating for this project, as the API was supposed to be a very simple process. As well, implmenting JWTs and validing w/ CORS was much more difficult using Rust than with Flask, so for me this change was a no-brainer. However, I will continue working with Rust on other projects, and perhaps revisit Rust for web development in the future!
