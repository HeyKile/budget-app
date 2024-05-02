setup:
	cd budget_app && cargo build

run:
	cd budget_app && cargo run --bin budget_app

initdb:
	cd budget_app && diesel database reset

test:
	chmod +x tests.sh && ./tests.sh