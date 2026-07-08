import { Router } from "express";
import { orderRoutes } from "./order.routes.js";
import { tableRoutes } from "./table.routes.js";

export const posRoutes = Router();

posRoutes.use(tableRoutes);
posRoutes.use(orderRoutes);
