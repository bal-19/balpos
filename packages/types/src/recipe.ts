export interface RecipeIngredient {
  stockItemId: string;
  stockItemName: string;
  unit: string;
  quantity: string;
}

export interface Recipe {
  productId: string;
  ingredients: RecipeIngredient[];
}
