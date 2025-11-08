import chalk from 'chalk';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { getClaudePaths } from '../utils/paths.js';

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
 * Get favorites file path
 */
function getFavoritesPath(): string {
  const paths = getClaudePaths();
  return join(paths.global, 'favorites.json');
}

/**
 * Load favorites data
 */
export async function loadFavorites(): Promise<FavoritesData> {
  const favoritesPath = getFavoritesPath();
  
  if (!existsSync(favoritesPath)) {
    return {
      favorites: [],
      collections: [],
      version: '1.0.0',
    };
  }

  try {
    const content = await readFile(favoritesPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return {
      favorites: [],
      collections: [],
      version: '1.0.0',
    };
  }
}

/**
 * Save favorites data
 */
export async function saveFavorites(data: FavoritesData): Promise<void> {
  const favoritesPath = getFavoritesPath();
  const { ensureDir } = await import('../utils/paths.js');
  const { dirname } = await import('path');
  
  await ensureDir(dirname(favoritesPath));
  await writeFile(favoritesPath, JSON.stringify(data, null, 2));
}

/**
 * Add package to favorites
 */
export async function addFavorite(
  packageId: string,
  packageName: string,
  packageType: string,
  notes?: string
): Promise<void> {
  const data = await loadFavorites();
  
  // Check if already favorited
  if (data.favorites.some((f) => f.packageId === packageId)) {
    throw new Error('Package already in favorites');
  }

  data.favorites.push({
    packageId,
    packageName,
    packageType,
    addedAt: new Date().toISOString(),
    notes,
  });

  await saveFavorites(data);
}

/**
 * Remove package from favorites
 */
export async function removeFavorite(packageId: string): Promise<void> {
  const data = await loadFavorites();
  data.favorites = data.favorites.filter((f) => f.packageId !== packageId);
  
  // Remove from collections too
  for (const collection of data.collections) {
    collection.packages = collection.packages.filter((f) => f.packageId !== packageId);
  }
  
  await saveFavorites(data);
}

/**
 * Create a collection
 */
export async function createCollection(
  name: string,
  description?: string,
  tags?: string[]
): Promise<Collection> {
  const data = await loadFavorites();
  
  const collection: Collection = {
    id: `collection-${Date.now()}`,
    name,
    description,
    packages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags,
  };

  data.collections.push(collection);
  await saveFavorites(data);
  
  return collection;
}

/**
 * Add package to collection
 */
export async function addToCollection(
  collectionId: string,
  packageId: string,
  packageName: string,
  packageType: string
): Promise<void> {
  const data = await loadFavorites();
  const collection = data.collections.find((c) => c.id === collectionId);
  
  if (!collection) {
    throw new Error('Collection not found');
  }

  if (collection.packages.some((f) => f.packageId === packageId)) {
    throw new Error('Package already in collection');
  }

  // Find favorite or create new
  let favorite = data.favorites.find((f) => f.packageId === packageId);
  if (!favorite) {
    favorite = {
      packageId,
      packageName,
      packageType,
      addedAt: new Date().toISOString(),
    };
    data.favorites.push(favorite);
  }

  collection.packages.push(favorite);
  collection.updatedAt = new Date().toISOString();
  
  await saveFavorites(data);
}

/**
 * Get all favorites
 */
export async function getFavorites(): Promise<Favorite[]> {
  const data = await loadFavorites();
  return data.favorites;
}

/**
 * Get all collections
 */
export async function getCollections(): Promise<Collection[]> {
  const data = await loadFavorites();
  return data.collections;
}

/**
 * Check if package is favorited
 */
export async function isFavorite(packageId: string): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.some((f) => f.packageId === packageId);
}
