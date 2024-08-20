#!/bin/bash

venv_setup() {
    if ! command -v python3 &> /dev/null
    then
        echo "Python3 is not installed. Please install Python3."
        return 1
    fi

    if ! python3 -m venv -h &> /dev/null
    then
        echo "Python venv module is not available. Please ensure it is installed."
        return 1
    fi

    echo "Setting up Python Venv"
    cd budget-app-api
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
    return 0
}

node_modules_setup() {
    if ! command -v node &> /dev/null
    then
        echo "Node.js is not installed. Please install Node.js."
        return 1
    fi

    if ! command -v npm &> /dev/null
    then
        echo "npm is not installed. Please install npm."
        return 1
    fi

    echo "Setting up Node.js modules"
    cd budget-app-ui
    npm install
    return 0
}

check_dependencies() {
    if ! command -v python3 &> /dev/null
    then
        echo "Python3 is not installed. Please install Python3."
        return 1
    fi

    if ! python3 -m venv -h &> /dev/null
    then
        echo "Python venv module is not available. Please ensure it is installed."
        return 1
    fi

    if ! command -v node &> /dev/null
    then
        echo "Node.js is not installed. Please install Node.js."
        return 1
    fi

    if ! command -v npm &> /dev/null
    then
        echo "npm is not installed. Please install npm."
        return 1
    fi

    return 0
}

if [[ "${BASH_SOURCE[0]}" -eq "${0}" ]]; then
    echo "Error: This script must be sourced to active venv correctly"
    echo "Hint: run script as 'source $(basename ${BASH_SOURCE[0]})'"
    exit 1
fi

result=$(check_dependencies)
if [ $result -eq 1 ]; then
    echo "Error: $result"
    exit 1
fi

echo "Setting up Python Venv"
cd budget-app-api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

echo "Setting up Node.js modules"
cd budget-app-ui
npm install
cd ..

echo "Successfully activate venv and installed node modules"
echo "Hint: to leave the venv, simply run 'deactivate'"