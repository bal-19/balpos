import type { Recipe as RecipeDto } from "@restaurant-pos/types";
import {
  createIngredients,
  deleteIngredientsForRecipe,
  findRecipeByProduct,
  upsertRecipe,
} from "../repository/recipe.repository.js";
import type { UpsertRecipeInput } from "../schema/recipe.schema.js";

export async function getProductRecipe(productId: string): Promise<RecipeDto> {
  const recipe = await findRecipeByProduct(productId);
  if (!recipe) return { productId, ingredients: [] };

  return {
    productId,
    ingredients: recipe.ingredients.map((ingredient) => ({
      stockItemId: ingredient.stockItemId,
      stockItemName: ingredient.stockItem.name,
      unit: ingredient.stockItem.unit,
      quantity: ingredient.quantity.toString(),
    })),
  };
}

export async function upsertProductRecipe(
  productId: string,
  outletId: string,
  input: UpsertRecipeInput,
): Promise<RecipeDto> {
  const recipe = await upsertRecipe(productId, outletId);
  await deleteIngredientsForRecipe(recipe.id);

  if (input.ingredients.length > 0) {
    await createIngredients(
      input.ingredients.map((ingredient) => ({
        recipeId: recipe.id,
        stockItemId: ingredient.stockItemId,
        quantity: ingredient.quantity,
      })),
    );
  }

  return getProductRecipe(productId);
}
