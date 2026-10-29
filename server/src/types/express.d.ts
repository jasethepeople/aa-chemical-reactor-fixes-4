// apps/server/src/types/express.d.ts
//
// FIX: routes/recipes.ts, middleware/audit.ts, and middleware/license.ts
// all read req.user, but Express's Request type has no such property.
// Under `strict` this fails to compile. This augmentation adds it.
//
// UPDATED: now imports UserLicense from LicenseService (server-local)
// instead of reaching across to the web app's types — the server
// shouldn't depend on the frontend package to compile.

import { UserLicense } from '../services/LicenseService';

export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        orgId?: string;
        role: 'student' | 'teacher' | 'admin';
        license: UserLicense;
      };
    }
  }
}
