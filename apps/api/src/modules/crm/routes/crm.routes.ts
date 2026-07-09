import { PERMISSION_CODES } from "@restaurant-pos/types";
import { Router } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { requireAuth } from "../../../shared/middlewares/require-auth.middleware.js";
import { requirePermission } from "../../../shared/middlewares/require-permission.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import * as customerController from "../controller/customer.controller.js";
import * as membershipTierController from "../controller/membership-tier.controller.js";
import { createCustomerSchema, updateCustomerSchema } from "../schema/customer.schema.js";
import { createMembershipTierSchema, updateMembershipTierSchema } from "../schema/membership-tier.schema.js";

export const crmRoutes = Router();

crmRoutes.use(requireAuth);

crmRoutes.get(
  "/customers",
  requirePermission(PERMISSION_CODES.CRM_VIEW),
  asyncHandler(customerController.listCustomers),
);
crmRoutes.get(
  "/customers/:id",
  requirePermission(PERMISSION_CODES.CRM_VIEW),
  asyncHandler(customerController.getCustomer),
);
crmRoutes.get(
  "/customers/:id/points",
  requirePermission(PERMISSION_CODES.CRM_VIEW),
  asyncHandler(customerController.getCustomerPoints),
);
crmRoutes.post(
  "/customers",
  requirePermission(PERMISSION_CODES.CRM_MANAGE),
  validate(createCustomerSchema),
  asyncHandler(customerController.createCustomer),
);
crmRoutes.patch(
  "/customers/:id",
  requirePermission(PERMISSION_CODES.CRM_MANAGE),
  validate(updateCustomerSchema),
  asyncHandler(customerController.updateCustomer),
);
crmRoutes.delete(
  "/customers/:id",
  requirePermission(PERMISSION_CODES.CRM_MANAGE),
  asyncHandler(customerController.deleteCustomer),
);

crmRoutes.get(
  "/membership-tiers",
  requirePermission(PERMISSION_CODES.CRM_VIEW),
  asyncHandler(membershipTierController.listMembershipTiers),
);
crmRoutes.post(
  "/membership-tiers",
  requirePermission(PERMISSION_CODES.CRM_MANAGE),
  validate(createMembershipTierSchema),
  asyncHandler(membershipTierController.createMembershipTier),
);
crmRoutes.patch(
  "/membership-tiers/:id",
  requirePermission(PERMISSION_CODES.CRM_MANAGE),
  validate(updateMembershipTierSchema),
  asyncHandler(membershipTierController.updateMembershipTier),
);
crmRoutes.delete(
  "/membership-tiers/:id",
  requirePermission(PERMISSION_CODES.CRM_MANAGE),
  asyncHandler(membershipTierController.deleteMembershipTier),
);
