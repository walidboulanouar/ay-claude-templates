/**
 * Favorites & Collections System
 * Save and organize favorite packages
 */
export interface Favorite {
    packageId: string;
    packageName: string;
    packageType: string;
    addedAt: string;
    notes?: string;
}
export interface Collection {
    id: string;
    name: string;
    description?: string;
    packages: Favorite[];
    createdAt: string;
    updatedAt: string;
    tags?: string[];
}
export interface FavoritesData {
    favorites: Favorite[];
    collections: Collection[];
    version: string;
}
/**
 * Load favorites data
 */
export declare function loadFavorites(): Promise<FavoritesData>;
/**
 * Save favorites data
 */
export declare function saveFavorites(data: FavoritesData): Promise<void>;
/**
 * Add package to favorites
 */
export declare function addFavorite(packageId: string, packageName: string, packageType: string, notes?: string): Promise<void>;
/**
 * Remove package from favorites
 */
export declare function removeFavorite(packageId: string): Promise<void>;
/**
 * Create a collection
 */
export declare function createCollection(name: string, description?: string, tags?: string[]): Promise<Collection>;
/**
 * Add package to collection
 */
export declare function addToCollection(collectionId: string, packageId: string, packageName: string, packageType: string): Promise<void>;
/**
 * Get all favorites
 */
export declare function getFavorites(): Promise<Favorite[]>;
/**
 * Get all collections
 */
export declare function getCollections(): Promise<Collection[]>;
/**
 * Check if package is favorited
 */
export declare function isFavorite(packageId: string): Promise<boolean>;
//# sourceMappingURL=favorites.d.ts.map