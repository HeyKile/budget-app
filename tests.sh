#!/bin/bash

# Test the root endpoint
# echo "Testing root endpoint..."
# curl -i http://localhost:3000/

# # Test the purchases endpoint
# echo "Testing purchases endpoint..."
# curl -i http://localhost:3000/purchases/

# # Test the categories endpoint
# echo "Testing categories endpoint..."
# curl -i http://localhost:3000/categories/

# # Test for making categories
# echo "Testing posting categories"
# curl -X POST -H "Content-Type: application/json" -d '{"name":"Groceries","budget":200}' http://localhost:3000/categories/
# curl -X POST -H "Content-Type: application/json" -d '{"name":"Null Budget Test"}' http://localhost:3000/categories/
# curl -X POST -H "Content-Type: application/json" -d '{}' http://localhost:3000/categories/

# # Test for making purchases
# echo "Testing posting purchases"
# curl -X POST -H "Content-Type: application/json" -d '{"desc":"a small pair of pants", "amount":20, "date":"2024-04-12", "cat_id":6}' http://localhost:3000/purchases/
# curl -X POST -H "Content-Type: application/json" -d '{"desc":"an incorrect date", "amount":20, "date":"2024-04-1", "cat_id":6}' http://localhost:3000/purchases/
# curl -X POST -H "Content-Type: application/json" -d '{"desc":"an incorrect date again", "amount":20, "date":"2024-04-32", "cat_id":6}' http://localhost:3000/purchases/
# curl -X POST -H "Content-Type: application/json" -d '{"desc":"the new month", "amount":20, "date":"2024-13-32", "cat_id":6}' http://localhost:3000/purchases/
# curl -X POST -H "Content-Type: application/json" -d '{"desc":"the new month", "amount":20, "date":"2024-04-12", "cat_id":1}' http://localhost:3000/purchases/

# Test for deleting purchases
# curl -X DELETE -H "Content-Type: application/json" http://localhost:3000/purchases/1

# curl -X DELETE -H "Content-Type: application/json" http://localhost:3000/categories/1

curl -X GET -H "Content-Type: application/json" http://localhost:3000/categories/

# Testing overages
echo "Test overages"
curl -X POST -H "Content-Type: application/json" -d '{"name":"Groceries","budget":200}' http://localhost:3000/categories/
curl -X POST -H "Content-Type: application/json" -d '{"desc":"bananas1", "amount":200, "date":"2024-04-12", "cat_id":1}' http://localhost:3000/purchases/
curl -X POST -H "Content-Type: application/json" -d '{"desc":"bananas2", "amount":1, "date":"2024-04-13", "cat_id":1}' http://localhost:3000/purchases/
curl -X POST -H "Content-Type: application/json" -d '{"desc":"bananas3", "amount":3, "date":"2024-04-14", "cat_id":1}' http://localhost:3000/purchases/
curl -X POST -H "Content-Type: application/json" -d '{"desc":"bananas4", "amount":199, "date":"2024-03-12", "cat_id":1}' http://localhost:3000/purchases/
curl -X POST -H "Content-Type: application/json" -d '{"desc":"bananas5", "amount":1, "date":"2024-03-13", "cat_id":1}' http://localhost:3000/purchases/
curl -X POST -H "Content-Type: application/json" -d '{"desc":"bananas6", "amount":35, "date":"2024-03-16", "cat_id":1}' http://localhost:3000/purchases/
curl -X POST -H "Content-Type: application/json" -d '{"desc":"bananas7", "amount":3, "date":"2024-02-14", "cat_id":1}' http://localhost:3000/purchases/
curl -X POST -H "Content-Type: application/json" -d '{"desc":"bananas8", "amount":80, "date":"2024-02-14", "cat_id":1}' http://localhost:3000/purchases/
curl -X POST -H "Content-Type: application/json" -d '{"desc":"bananas9", "amount":150, "date":"2024-02-15", "cat_id":1}' http://localhost:3000/purchases/

curl -X POST -H "Content-Type: application/json" -d '{"name":"Fortnite","budget":100}' http://localhost:3000/categories/

curl -X POST -H "Content-Type: application/json" -d '{"desc":"vbucks again", "amount":10, "date":"2024-04-13", "cat_id":2}' http://localhost:3000/purchases/

curl -X POST -H "Content-Type: application/json" -d '{"desc":"vbucks again in march", "amount":10, "date":"2024-03-13", "cat_id":2}' http://localhost:3000/purchases/
curl -X POST -H "Content-Type: application/json" -d '{"desc":"vbucks again again in march", "amount":10, "date":"2024-03-14", "cat_id":2}' http://localhost:3000/purchases/

curl -X POST -H "Content-Type: application/json" -d '{"desc":"vbucks for jan", "amount":179, "date":"2024-01-14", "cat_id":2}' http://localhost:3000/purchases/

curl -X POST -H "Content-Type: application/json" -d '{"desc":"vbucks for jan before", "amount":179, "date":"2023-01-14", "cat_id":2}' http://localhost:3000/purchases/
curl -X POST -H "Content-Type: application/json" -d '{"desc":"puke", "amount":200, "date":"2023-01-14", "cat_id":2}' http://localhost:3000/purchases/

curl -X POST -H "Content-Type: application/json" -d '{"desc":"new puke", "amount":200, "date":"2024-01-14", "cat_id":2}' http://localhost:3000/purchases/

# curl -X POST -H "Content-Type: application/json" -d '{"all_categories":true}' http://localhost:3000/overages