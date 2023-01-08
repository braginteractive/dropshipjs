# DropshipJS

[![DropshipJS](https://img.youtube.com/vi/EnmaNiDc0NA/maxresdefault.jpg)](https://www.youtube.com/watch?v=EnmaNiDc0NA)

Started from the Remix Blues stack and turned into the start of a eCommerce CMS built with all the latest javascript tools and resources.
[dropshipjs.com](https://dropshipjs.com/)

- Remix.run is a full stack web framework that lets you focus on the user interface and work back through web standards to deliver a fast, slick, and resilient user experience.
- Printful is used for custom products and merchandise and fulfillment.
- Stripe is used for payment processing.
- Cloudinary for media hosting and delivery.
- SendGrid for sending transactional emails.
- TailwindCSS for all the styling. Cant imagine having to manage stylesheets ever again. Utility classes are great.
- Prisma makes it easy to to manage all the data from the Postgres database.
- Fly.io for deployment/hosting close to your users.

## Remix Blues Stack

Learn more about [Remix Stacks](https://remix.run/stacks).
Getting setup [Blues Stack GitHub](https://github.com/remix-run/blues-stack)

## What's in the Blues stack

- [Multi-region Fly app deployment](https://fly.io/docs/reference/scaling/) with [Docker](https://www.docker.com/)
- [Multi-region Fly PostgreSQL Cluster](https://fly.io/docs/getting-started/multi-region-databases/)
- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Email/Password Authentication with [cookie-based sessions](https://remix.run/docs/en/v1/api/remix#createcookiesessionstorage)
- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)
