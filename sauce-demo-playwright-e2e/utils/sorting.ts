import { ProductsPage } from '../pages/ProductsPage';

export const sortingHelpers = {
  sortOptionMap: {
    'name ascending': 'az',
    'name descending': 'za',
    'price ascending': 'lohi',
    'price descending': 'hilo'
  } as const,

  async verifySort(productsPage: ProductsPage, sortType: string, maxRetries: number = 3): Promise<void> {
    let isSorted = false;
    let retries = maxRetries;
    let lastError: Error | null = null;
    
    while (retries > 0 && !isSorted) {
      try {
        isSorted = await this.checkSorting(productsPage, sortType);
        
        if (isSorted) {
          return;
        }
        
        if (retries > 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (e) {
        lastError = e as Error;
        if (retries === 1) {
          throw new Error(`Failed to verify sorting by ${sortType}: ${lastError.message}`);
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      retries--;
    }
    
    throw new Error(`Products failed to sort by ${sortType} after ${maxRetries - retries} attempts. ${lastError?.message || ''}`);
  },

  async checkSorting(productsPage: ProductsPage, sortType: string): Promise<boolean> {
    switch (sortType) {
      case 'name ascending':
        return await productsPage.isSortedAlphabetically(true);
      case 'name descending':
        return await productsPage.isSortedAlphabetically(false);
      case 'price ascending':
        return await productsPage.isSortedByPrice(true);
      case 'price descending':
        return await productsPage.isSortedByPrice(false);
      default:
        throw new Error(`Invalid sort type: ${sortType}`);
    }
  },

  validateSortOption(option: string): void {
    if (!(option in this.sortOptionMap)) {
      throw new Error(`Invalid sort option: ${option}. Valid options are: ${Object.keys(this.sortOptionMap).join(', ')}`);
    }
  }
}; 