const ADMIN_KEY_HEADER = "x-admin-key";

export function requireAdminKey(req, res, next) {
  const configuredAdminKey = process.env.ADMIN_API_KEY?.trim();

  if (!configuredAdminKey) {
    return res.status(503).json({
      error: "FAQ write access is not configured on this server."
    });
  }

  const providedAdminKey = req.get(ADMIN_KEY_HEADER)?.trim();

  if (providedAdminKey !== configuredAdminKey) {
    return res.status(401).json({
      error: `Unauthorized. Provide a valid ${ADMIN_KEY_HEADER} header.`
    });
  }

  return next();
}
