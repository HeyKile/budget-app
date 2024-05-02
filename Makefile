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