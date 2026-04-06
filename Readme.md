# Backend Features Practice

Hands-on practice project for common backend architecture and feature patterns using NestJS and MongoDB.

## Practice Goals

- Practice Redis integration in NestJS
- Practice MongoDB design and data access
- Practice authentication in NestJS
- Practice role-based authorization in NestJS
- Practice multi-tenant architecture design

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

## Suggested Stack

- NestJS
- MongoDB + Mongoose
- Redis
- JWT + Passport
- Class Validator

## Suggested Project Structure

```text
src/
	auth/
	users/
	roles/
	tenants/
	cache/
	common/
```

## Practice Roadmap

1. Setup NestJS project and base modules
2. Connect MongoDB and build CRUD APIs
3. Add authentication with JWT
4. Add role-based authorization
5. Integrate Redis caching and rate limit basics
6. Introduce tenant context and enforce tenant-scoped queries
7. Add tests for auth, RBAC, and tenant isolation

## Definition of Done

- Auth-protected endpoints work correctly
- Role restrictions are enforced
- Redis caching works for selected heavy endpoints
- Tenant isolation is validated
- Basic tests cover critical security and data isolation paths

## Future Enhancements

- Centralized audit logging
- API versioning
- Background jobs with queues
- Observability (metrics, tracing, logs)

---

This repository is intended for learning-by-building. Keep each feature branch focused on one practice area and document decisions as you progress.
