export function flattenSalonServices(salon) {
  return (salon?.services || []).flatMap(cat =>
    (cat.items || []).map(item => ({
      id: item.id,
      name: item.name,
      duration: item.duration,
      price: item.price,
      category: cat.category,
      categoryIcon: cat.icon,
    }))
  )
}
