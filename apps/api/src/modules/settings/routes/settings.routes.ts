import { Router } from "express";
import { categoryRoutes } from "./category.routes.js";
import { productRoutes } from "./product.routes.js";
import { storeSettingRoutes } from "./store-setting.routes.js";

export const settingsRoutes = Router();

settingsRoutes.use(storeSettingRoutes);
settingsRoutes.use(categoryRoutes);
settingsRoutes.use(productRoutes);
