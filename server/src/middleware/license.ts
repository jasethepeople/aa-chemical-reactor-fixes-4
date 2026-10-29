// apps/server/src/middleware/license.ts
//
// Uses LicenseService.hasFeature for the check instead of directly
// indexing license.features[feature], so the "is this feature on"
// logic lives in one place (LicenseService) rather than being
// duplicated/redefined in the middleware.

import { Request, Response, NextFunction } from 'express';
import { LicenseService, LicenseFeatures } from '../services/LicenseService';

export const checkLicense = (feature: keyof LicenseFeatures) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const license = req.user?.license;

    if (!license) {
      return res.status(403).json({ error: 'No license found' });
    }

    if (!LicenseService.hasFeature(license, feature)) {
      return res.status(403).json({
        error: 'Feature not available in your license tier',
        upgradeUrl: '/upgrade',
      });
    }

    next();
  };
};
