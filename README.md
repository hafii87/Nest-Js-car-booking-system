
# 🚗 Car Booking System

A scalable microservices-based car booking platform built with NestJS and MongoDB. The system allows users to book cars, manage groups, and handle bookings through a clean REST API gateway.

---

## 📋 Features

- **User Management** – Create, update, deactivate, and delete users; lookup by email or ID
- **Car Management** – CRUD operations for cars, car rules (verification requirements), and deactivation
- **Booking Management** – Create, update, cancel, end, and remove bookings with status tracking
- **Group Management** – Create groups, manage members, assign group rules, and track group bookings
- **Microservices Architecture** – Each domain runs as an independent TCP microservice
- **API Gateway** – Single HTTP entry point that routes requests to the appropriate microservice
- **MongoDB Integration** – Mongoose ODM with schema-based models for all entities

---

## 🛠 Technologies Used

| Technology | Purpose |
|---|---|
| [NestJS](https://nestjs.com/) | Backend framework |
| [MongoDB](https://www.mongodb.com/) | Database |
| [Mongoose](https://mongoosejs.com/) | ODM for MongoDB |
| TypeScript | Language |
| NestJS Microservices (TCP) | Inter-service communication |
| Jest | Unit & integration testing |
| class-validator / class-transformer | DTO validation |

---

## ⚙️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd car-booking-system

# Install dependencies
npm install
```

Ensure MongoDB is running locally or set the `MONGODB_URI` environment variable:

```bash
export MONGODB_URI=mongodb://localhost:27017/car-booking-system
# or use MongoDB Atlas
export MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/car-booking-system
```

---

## ▶️ Running the Project

### Development (All services concurrently)

```bash
npm run dev
```

### Individual Services

```bash
# API Gateway (HTTP on port 3000)
npm run start:gateway

# User Microservice (TCP port 8879)
npm run start:user

# Car Microservice (TCP port 8878)
npm run start:car

# Booking Microservice (TCP port 8877)
npm run start:booking

# Group Microservice (TCP port 8880)
npm run start:group
```

### Production

```bash
npm run build
npm run start:prod
```

### Tests

```bash
npm run test          # Unit tests
npm run test:cov      # Coverage report
npm run test:e2e      # End-to-end tests
```

---

## 🌐 API Endpoints

| Resource | Base Path |
|---|---|
| Users | `GET/POST/PUT/DELETE /api/users` |
| Cars | `GET/POST/PUT/DELETE /api/cars` |
| Bookings | `GET/POST/PUT/DELETE /api/bookings` |
| Groups | `GET/POST/PUT/DELETE /api/groups` |

---

## 📁 Project Structure

```
src/
├── api/
│   ├── booking/          # Booking module (controller, service, DTOs, schema)
│   ├── car/              # Car module (controller, service, DTOs, schema)
│   ├── group/            # Group module (controller, service, DTOs, schema)
│   ├── user/             # User module (controller, service, DTOs, schema)
│   └── gateway/          # HTTP API Gateway (routes to microservices via TCP)
├── microservices/        # Entry points for each microservice
│   ├── booking.microservice.ts
│   ├── car.microservice.ts
│   ├── group.microservice.ts
│   └── user.microservice.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
test/                     # E2E tests
```

---

## 🔌 Service Ports

| Service | Transport | Port |
|---|---|---|
| HTTP Gateway | HTTP | 3000 |
| Booking Service | TCP | 8877 |
| Car Service | TCP | 8878 |
| User Service | TCP | 8879 |
| Group Service | TCP | 8880 |





<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
