# ADR 001: Modular Monolith with Schema-per-Module Architecture

## Status
Accepted

## Context
Manga is a high-scale multi-vendor marketplace platform. Microservices introduce early operational friction, distributed transaction complexity, and network latency overhead. However, a traditional monolithic database leads to tight coupling, leaky domain abstractions, and migration gridlock.

## Decision
We adopt a **modular monolith** running within a single deployable backend (NestJS/Node.js) with strict module boundaries:
1. Each domain module owns its private PostgreSQL schema (`orders.*`, `ledger.*`, `inventory.*`, etc.).
2. Cross-module database table joins and direct table access are strictly forbidden.
3. Modules communicate exclusively via public module service interfaces or asynchronous domain events.
4. Independent module migrations can run without impacting other domains.

## Consequences
- High development velocity and simplified local orchestration.
- Zero distributed transaction overhead for local sagas.
- Clear extraction seams: high-throughput modules (e.g. tracking ingestion or search indexing) can be isolated and extracted to independent microservices when scale demands.
