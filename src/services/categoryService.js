import ApiError from '../utils/ApiError.js';
import * as categoryRepo from '../repositories/categoryRepo.js';

function parseId(id) {
  const value = Number(id);
  if (!Number.isInteger(value) || value <= 0) throw new ApiError(400, 'Invalid ID format');
  return value;
}

export async function createCategory(data) {
  if (!data.name?.trim()) throw new ApiError(400, 'name is required');
  return categoryRepo.create({ name: data.name.trim() });
}

export async function listCategories(query) {
  if (Object.keys(query).length) throw new ApiError(400, 'Unexpected query parameter');
  return categoryRepo.getAll();
}

export async function getCategory(id) {
  const category = await categoryRepo.getById(parseId(id));
  if (!category) throw new ApiError(404, 'Category not found');
  return category;
}

export async function updateCategory(id, data) {
  if (!data.name?.trim()) throw new ApiError(400, 'name is required');
  await getCategory(id);
  return categoryRepo.update(parseId(id), { name: data.name.trim() });
}

export async function deleteCategory(id) {
  await getCategory(id);
  await categoryRepo.remove(parseId(id));
}
