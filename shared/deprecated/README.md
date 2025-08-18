# Deprecated Drizzle Schema (`schema.ts`)

## Why was it deprecated?
The original `shared/schema.ts` file defined a large **Drizzle ORM** schema that we used during the very first prototype phase when the frontend relied on **local stub data** instead of a real backend.  
Now that the project has a fully-featured Django REST API and an **OpenAPI specification**, the Drizzle schema no longer represents the true contract and has already caused type mismatches and confusion (see Issue #24).

## What should you use instead?
All production code **must** import types generated from the OpenAPI spec:

```
import type { Batch } from "@/api/generated/models/Batch";
```

These model files live under:

```
client/src/api/generated/models/
```

and are regenerated automatically by CI whenever the backend contract changes.

## Why keep this file at all?
* Historical reference – it shows the early relational structure we explored.
* Some devs still run `drizzle-kit` migrations locally for experimentation; that tooling expects a schema file path and points to this one via `drizzle.config.ts`.

If you are not explicitly running Drizzle experiments, **you can ignore everything in this directory**.

## ⚠️  Important Warning
**Do NOT import anything from `shared/deprecated/schema.ts` (or `@shared/schema`) in production code.**  
An ESLint rule (`no-restricted-imports`) will now fail your build if you do.

## Further Context
Full details of the migration and deprecation can be found in **Issue #24: “Remove or deprecate shared/schema.ts in favor of OpenAPI-generated types.”**
