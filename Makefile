setup:
	cd budget_app && cargo build

backend:
	cd budget_app && cargo run --bin budget_app

frontend:
	cd budget-app-ui && npm start

initdb:
	cd budget_app && diesel database reset

test:
	chmod +x tests.sh && ./tests.sh

flask run:
	cd budget-app-api && python3 -m flask && flask --app budget_app run

flask initdb:
	cd budget-app-api && flask --app budget_app.py initdb