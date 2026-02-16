  Deployment

vpc-inj-light-er3xhv84s-wheddy123s-projects.vercel.app

  Domains

vpc-inj-light-api.vercel.app



VPC Injective Light API

Lightweight REST API for querying Injective blockchain data on testnet.

Overview

Fastify-based read-only service exposing basic Injective Testnet data through simple REST endpoints. Designed for hackathon demo and low-memory environments.

Features

GET /health — Service health check

GET /balance/:address — Query bank balances

GET /tx/:address — Query transaction history

Tech Stack

Fastify

@injectivelabs/sdk-ts

Injective Testnet

Installation
npm install

Run
npm start


Development mode:

npm run dev


Default port: 3000 (override with PORT environment variable).

API
Health
GET /health


Response:

{
  "status": "ok",
  "network": "injective-testnet",
  "timestamp": "2025-02-13T10:00:00.000Z"
}

Balance
GET /balance/:address


Example:

curl http://localhost:3000/balance/inj1...


Response:

{
  "address": "inj1...",
  "network": "injective-testnet",
  "balances": [
    {
      "denom": "inj",
      "amount": "1000000000000000000"
    }
  ]
}

Transactions
GET /tx/:address?limit=10&skip=0


Query parameters:

limit (default: 10)

skip (default: 0)

Example:

curl "http://localhost:3000/tx/inj1...?limit=5"


Response:

{
  "address": "inj1...",
  "network": "injective-testnet",
  "transactions": [],
  "pagination": {
    "limit": 10,
    "skip": 0,
    "total": 0
  }
}

Configuration
Variable	Default
PORT	3000
Notes

Testnet only

Read-only API

No private key handling

License

ISC
