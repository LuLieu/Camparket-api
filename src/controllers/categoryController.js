import * as categoryService from '../services/categoryService.js';

export async function create(req, res) {
  res.status(201).json(await categoryService.createCategory(req.body));
}

export async function list(req, res) {
  res.status(200).json(await categoryService.listCategories(req.query));
}

export async function get(req, res) {
  res.status(200).json(await categoryService.getCategory(req.params.id));
}

export async function update(req, res) {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  res.status(200).json({ message: 'Category updated successfully', category });
}

export async function remove(req, res) {
  await categoryService.deleteCategory(req.params.id);
  res.status(200).json({ message: 'Category deleted successfully' });
}
