import prisma from '../config/db.js';

export function create(categoryData) {
  return prisma.category.create({ data: categoryData });
}

export function getAll() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
}

export function getById(categoryId) {
  return prisma.category.findUnique({ where: { category_id: categoryId } });
}

export function update(categoryId, categoryData) {
  return prisma.category.update({
    where: { category_id: categoryId },
    data: categoryData,
  });
}

export function remove(categoryId) {
  return prisma.category.delete({ where: { category_id: categoryId } });
}
