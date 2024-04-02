import LoginProducts from "./loginProducts";
import { LoginType } from "./types";

export const Recipes: Record<string, LoginType> = {
  DISCOVERY: {
    id: "discovery",
    title: "Discovery flow",
    description:
      "In this recipe we demonstrate a backend implementation of our Discovery login flow with custom UI components. This flow allows users to log into any Organization that they have access to using either Google OAuth, Microsoft OAuth, or Email Magic Links. Users can also create a new Organization.",
    url: "/discovery",
    products: [LoginProducts.EML, LoginProducts.OAUTH],
  },
  ORGANIZATION: {
    id: "organization",
    title: "Organization flow",
    description:
      "In this recipe we demonstrate a backend implementation of our Organization login flow with custom UI components. This flow allows users to log into a specific Organization using Email Magic Links, OAuth, or SSO, provided they know the Organization's slug or login URL.",
    url: "/organization-lookup",
    products: [LoginProducts.EML, LoginProducts.OAUTH, LoginProducts.SSO],
  },
};

export const getRecipeFromId = (id?: string) => {
  for (const recipe of Object.values(Recipes)) {
    if (id === recipe.id && !recipe.preventClickthrough) {
      return recipe;
    }
  }

  return null;
};
