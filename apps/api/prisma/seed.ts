import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/modules/auth/utils/password.util.js";

const prisma = new PrismaClient();

const PERMISSIONS = [
  { code: "dashboard.view", module: "dashboard", description: "Lihat dashboard overview & report" },
  { code: "settings.view", module: "settings", description: "Lihat store setting" },
  { code: "settings.manage", module: "settings", description: "Ubah store setting" },
  { code: "catalog.view", module: "settings", description: "Lihat kategori & produk" },
  { code: "catalog.manage", module: "settings", description: "Kelola kategori & produk" },
  { code: "pos.table.view", module: "pos", description: "Lihat daftar meja" },
  { code: "pos.order.create", module: "pos", description: "Buat order/checkout" },
  { code: "kitchen.view", module: "kitchen", description: "Lihat order aktif di Kitchen Display" },
  { code: "kitchen.manage", module: "kitchen", description: "Update status masak item order" },
  { code: "inventory.view", module: "inventory", description: "Lihat stok bahan baku" },
  { code: "inventory.manage", module: "inventory", description: "Kelola stok bahan baku" },
  { code: "recipe.view", module: "recipe", description: "Lihat resep produk" },
  { code: "recipe.manage", module: "recipe", description: "Kelola resep produk" },
  { code: "supplier.view", module: "supplier", description: "Lihat supplier & purchase order" },
  { code: "supplier.manage", module: "supplier", description: "Kelola supplier & purchase order" },
  { code: "crm.view", module: "crm", description: "Lihat pelanggan, membership tier & riwayat poin" },
  { code: "crm.manage", module: "crm", description: "Kelola pelanggan & membership tier" },
  { code: "promotion.view", module: "promotion", description: "Lihat daftar promo" },
  { code: "promotion.manage", module: "promotion", description: "Kelola promo (voucher/discount/happy hour/buy x get y)" },
  { code: "reservation.view", module: "reservation", description: "Lihat jadwal reservasi meja" },
  { code: "reservation.manage", module: "reservation", description: "Kelola reservasi meja (booking, check-in, batal)" },
  { code: "role.manage", module: "auth", description: "Kelola role & permission (cadangan, belum dipakai UI)" },
  { code: "report.view", module: "report", description: "Lihat ringkasan laporan & riwayat export" },
  { code: "report.manage", module: "report", description: "Buat export laporan PDF/Excel" },
  { code: "audit-log.view", module: "audit-log", description: "Lihat riwayat aktivitas pengguna" },
  { code: "analytics.view", module: "ai", description: "Lihat insight AI yang sudah dibuat" },
  { code: "analytics.manage", module: "ai", description: "Minta pembuatan insight AI baru" },
  { code: "pos.shift.view", module: "pos", description: "Lihat status sesi kasir yang sedang berjalan" },
  { code: "pos.shift.manage", module: "pos", description: "Buka & tutup sesi kasir" },
] as const;

const STOCK_ITEMS = [
  { name: "Kopi Bubuk", unit: "gram", currentStock: "5000", minStockThreshold: "1000" },
  { name: "Susu", unit: "ml", currentStock: "10000", minStockThreshold: "2000" },
  { name: "Gula", unit: "gram", currentStock: "300", minStockThreshold: "500" },
] as const;

/** productName -> daftar bahan baku (stockItemName + quantity) sesuai satuan StockItem di atas. */
const RECIPES: Record<string, { stockItemName: string; quantity: string }[]> = {
  Espresso: [{ stockItemName: "Kopi Bubuk", quantity: "18" }],
  Cappuccino: [
    { stockItemName: "Kopi Bubuk", quantity: "18" },
    { stockItemName: "Susu", quantity: "150" },
  ],
  Latte: [
    { stockItemName: "Kopi Bubuk", quantity: "18" },
    { stockItemName: "Susu", quantity: "200" },
  ],
};

const CATALOG: Record<string, { name: string; price: string }[]> = {
  Coffee: [
    { name: "Espresso", price: "18000" },
    { name: "Americano", price: "20000" },
    { name: "Cappuccino", price: "24000" },
    { name: "Latte", price: "24000" },
  ],
  Tea: [
    { name: "Lemon Tea", price: "16000" },
    { name: "Milk Tea", price: "20000" },
    { name: "Chamomile Tea", price: "18000" },
  ],
  Snack: [
    { name: "Croissant", price: "22000" },
    { name: "Banana Cake", price: "18000" },
    { name: "French Fries", price: "20000" },
  ],
};

async function main() {
  let tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    tenant = await prisma.tenant.create({ data: { name: "Default Tenant" } });
  }

  let outlet = await prisma.outlet.findFirst({ where: { tenantId: tenant.id } });
  if (!outlet) {
    outlet = await prisma.outlet.create({
      data: { tenantId: tenant.id, name: "Outlet Utama" },
    });
  }

  const permissions = await Promise.all(
    PERMISSIONS.map((permission) =>
      prisma.permission.upsert({
        where: { code: permission.code },
        update: {},
        create: permission,
      }),
    ),
  );

  const ownerRole = await prisma.role.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: "OWNER" } },
    update: {},
    create: { tenantId: tenant.id, code: "OWNER", name: "Owner", isSystem: true },
  });

  const cashierRole = await prisma.role.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: "CASHIER" } },
    update: {},
    create: { tenantId: tenant.id, code: "CASHIER", name: "Cashier", isSystem: true },
  });

  await Promise.all(
    permissions.map((permission) =>
      prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: ownerRole.id, permissionId: permission.id } },
        update: {},
        create: { roleId: ownerRole.id, permissionId: permission.id },
      }),
    ),
  );

  const cashierPermissionCodes = [
    "catalog.view",
    "pos.table.view",
    "pos.order.create",
    "pos.shift.view",
    "pos.shift.manage",
    "crm.view",
    "promotion.view",
    "reservation.view",
    "reservation.manage",
  ];
  await Promise.all(
    permissions
      .filter((permission) => cashierPermissionCodes.includes(permission.code))
      .map((permission) =>
        prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: cashierRole.id, permissionId: permission.id } },
          update: {},
          create: { roleId: cashierRole.id, permissionId: permission.id },
        }),
      ),
  );

  const kitchenRole = await prisma.role.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: "KITCHEN" } },
    update: {},
    create: { tenantId: tenant.id, code: "KITCHEN", name: "Kitchen", isSystem: true },
  });

  const kitchenPermissionCodes = ["kitchen.view", "kitchen.manage"];
  await Promise.all(
    permissions
      .filter((permission) => kitchenPermissionCodes.includes(permission.code))
      .map((permission) =>
        prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: kitchenRole.id, permissionId: permission.id } },
          update: {},
          create: { roleId: kitchenRole.id, permissionId: permission.id },
        }),
      ),
  );

  await prisma.user.upsert({
    where: { email: "owner@balpos.local" },
    update: {},
    create: {
      tenantId: tenant.id,
      outletId: outlet.id,
      roleId: ownerRole.id,
      name: "Owner Demo",
      email: "owner@balpos.local",
      passwordHash: await hashPassword("Owner#123"),
    },
  });

  await prisma.user.upsert({
    where: { email: "cashier@balpos.local" },
    update: {},
    create: {
      tenantId: tenant.id,
      outletId: outlet.id,
      roleId: cashierRole.id,
      name: "Cashier Demo",
      email: "cashier@balpos.local",
      passwordHash: await hashPassword("Cashier#123"),
    },
  });

  await prisma.user.upsert({
    where: { email: "kitchen@balpos.local" },
    update: {},
    create: {
      tenantId: tenant.id,
      outletId: outlet.id,
      roleId: kitchenRole.id,
      name: "Kitchen Demo",
      email: "kitchen@balpos.local",
      passwordHash: await hashPassword("Kitchen#123"),
    },
  });

  await prisma.storeSetting.upsert({
    where: { outletId: outlet.id },
    update: {},
    create: {
      outletId: outlet.id,
      storeName: "Bal POS Demo",
      primaryColor: "#2C4A3B",
      taxPercent: "10",
      serviceChargePercent: "0",
      currency: "IDR",
    },
  });

  for (const [categoryName, products] of Object.entries(CATALOG)) {
    const category = await prisma.category.upsert({
      where: { outletId_name: { outletId: outlet.id, name: categoryName } },
      update: {},
      create: { outletId: outlet.id, name: categoryName },
    });

    for (const product of products) {
      const existing = await prisma.product.findFirst({
        where: { outletId: outlet.id, categoryId: category.id, name: product.name },
      });
      if (!existing) {
        await prisma.product.create({
          data: {
            outletId: outlet.id,
            categoryId: category.id,
            name: product.name,
            price: product.price,
          },
        });
      }
    }
  }

  const stockItemByName = new Map<string, { id: string }>();
  for (const stockItem of STOCK_ITEMS) {
    const created = await prisma.stockItem.upsert({
      where: { outletId_name: { outletId: outlet.id, name: stockItem.name } },
      update: {},
      create: { ...stockItem, outletId: outlet.id },
    });
    stockItemByName.set(stockItem.name, created);
  }

  for (const [productName, ingredients] of Object.entries(RECIPES)) {
    const product = await prisma.product.findFirst({
      where: { outletId: outlet.id, name: productName },
    });
    if (!product) continue;

    const recipe = await prisma.recipe.upsert({
      where: { productId: product.id },
      update: {},
      create: { productId: product.id, outletId: outlet.id },
    });

    for (const ingredient of ingredients) {
      const stockItem = stockItemByName.get(ingredient.stockItemName);
      if (!stockItem) continue;

      await prisma.recipeIngredient.upsert({
        where: { recipeId_stockItemId: { recipeId: recipe.id, stockItemId: stockItem.id } },
        update: { quantity: ingredient.quantity },
        create: { recipeId: recipe.id, stockItemId: stockItem.id, quantity: ingredient.quantity },
      });
    }
  }

  const supplier = await prisma.supplier.findFirst({
    where: { outletId: outlet.id, name: "Sumber Kopi Nusantara" },
  });
  if (!supplier) {
    await prisma.supplier.create({
      data: {
        outletId: outlet.id,
        name: "Sumber Kopi Nusantara",
        phone: "0812-3456-7890",
        address: "Jl. Raya Kopi No. 1, Bandung",
      },
    });
  }

  const tableNames = ["T1", "T2", "T3", "T4", "T5", "T6"];
  await Promise.all(
    tableNames.map((name) =>
      prisma.table.upsert({
        where: { outletId_name: { outletId: outlet.id, name } },
        update: {},
        create: { outletId: outlet.id, name, capacity: 4 },
      }),
    ),
  );

  console.log("=== Seed selesai ===");
  console.log("Owner  : owner@balpos.local  / Owner#123");
  console.log("Cashier: cashier@balpos.local / Cashier#123");
  console.log("Kitchen: kitchen@balpos.local / Kitchen#123");
  console.log("Table IDs (untuk QR ordering):", tableNames.join(", "), "— cek Prisma Studio untuk id aslinya.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
