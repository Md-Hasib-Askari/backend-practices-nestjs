# Backend Features Practice

Hands-on practice project for common backend architecture and feature patterns using NestJS and MongoDB.

## Quick Navigation

- [Reference Guide](nestjs-reference.html)
- [Redis Guided Exercises](01-redis-nestjs/redis-guided-exercises.html)
- [MongoDB Exercises](02-mongodb/mongodb-exercises.html)
- [Authentication Exercises](03-authentication-nestjs/authentication-exercises.html)
- [RBAC Exercises](04-role-based-auth-nestjs/rbac-exercises.html)
- [Multi-Tenant Exercises](05-multi-tenant-architecture/multi-tanent-exercises.html)
- [Rate Limiting Exercises](06-rate-limit-nestjs/rate-limiting-exercises.html)
- [CSRF and CSP Exercises](07-csrf-csp/csrf-csp-practice.html)

## Practice Goals

- Practice Redis integration in NestJS
- Practice MongoDB design and data access
- Practice authentication in NestJS
- Practice role-based authorization in NestJS
- Practice multi-tenant architecture design
- Practice API rate limiting patterns in NestJS
- Practice CSRF and CSP hardening in NestJS

## Core Topics

### 1. Redis in NestJS

Focus areas:

- Caching API responses
- Cache invalidation strategies
- Rate limiting with Redis
- Session/token storage (optional)

Suggested outcomes:

- Add Redis as a cache layer
- Implement TTL-based caching for selected endpoints
- Measure performance difference with and without cache

### 2. MongoDB Practice

Focus areas:

- Schema design with Mongoose
- Relations and references between collections
- Indexing and query optimization
- Data validation and pagination

Suggested outcomes:

- Build CRUD for at least 2 entities
- Add pagination, filtering, and sorting
- Add proper indexes for common queries

### 3. Authentication in NestJS

Focus areas:

- Signup/login flow
- Password hashing (bcrypt)
- JWT access token strategy
- Guards and request-level protection

Suggested outcomes:

- Create auth module with register and login
- Protect private routes using JWT guard
- Add refresh token flow (recommended)

### 4. Role-Based Authorization in NestJS

Focus areas:

- Define roles (Admin, User, etc.)
- Role decorator and roles guard
- Route-level permission checks
- Security best practices

Suggested outcomes:

- Restrict selected endpoints by role
- Demonstrate role-based access with test users

### 5. Multi-Tenant Architecture

Focus areas:

- Tenant identification (header, subdomain, or token claim)
- Tenant-aware data access pattern
- Data isolation strategy
- Per-tenant configuration and scaling considerations

Suggested outcomes:

- Implement tenant context middleware/guard
- Ensure all queries are tenant-scoped
- Prevent cross-tenant data leaks

### 6. Rate Limiting in NestJS

Focus areas:

- Throttler setup and per-route limits
- Redis-backed distributed rate limiting
- Plan-based and user-based quotas
- Retry headers and client backoff patterns

Suggested outcomes:

- Configure global and route-specific limits
- Add persistent/distributed limit storage with Redis
- Test and validate 429 handling with retry behavior

### 7. CSRF and CSP Security

Focus areas:

- CSRF threat model and token protection
- Cookie hardening with SameSite settings
- CSP headers and nonce-based script control
- Helmet-based security header configuration

Suggested outcomes:

- Protect state-changing routes against CSRF
- Configure CSP and validate violations in browser
- Apply a baseline secure header profile to the app

## Suggested Stack

- NestJS
- MongoDB + Mongoose
- Redis
- JWT + Passport
- Class Validator
- Throttler
- Helmet

## Suggested Project Structure

```text
01-redis-nestjs/
02-mongodb/
03-authentication-nestjs/
04-role-based-auth-nestjs/
05-multi-tenant-architecture/
06-rate-limit-nestjs/
07-csrf-csp/
nestjs-reference.html
README.md
```

## Practice Roadmap

1. Setup NestJS project and base modules
2. Connect MongoDB and build CRUD APIs
3. Add authentication with JWT
4. Add role-based authorization
5. Integrate Redis caching patterns
6. Introduce tenant context and enforce tenant-scoped queries
7. Add API rate limiting with route-level policies
8. Harden CSRF and CSP defenses
9. Add tests for auth, RBAC, tenant isolation, and security middleware

## Definition of Done

- Auth-protected endpoints work correctly
- Role restrictions are enforced
- Redis caching works for selected heavy endpoints
- Tenant isolation is validated
- Rate limiting policies return correct 429 behavior
- CSRF/CSP protections are validated in browser and API tests
- Basic tests cover critical security and data isolation paths

## Future Enhancements

- Centralized audit logging
- API versioning
- Background jobs with queues
- Observability (metrics, tracing, logs)

---

This repository is intended for learning-by-building. Keep each feature branch focused on one practice area and document decisions as you progress.
