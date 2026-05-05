const CATEGORY_TO_ICON = {
  'Orlik': 'ball',
  'Boisko piłkarskie': 'ball',
  'Piłka nożna': 'ball',
  'Kort tenisowy': 'racket',
  'Tenis': 'racket',
  'Squash': 'racket',
  'Hala sportowa': 'court',
  'Koszykówka': 'court',
  'Siatkówka': 'court',
  'Basen': 'pool',
  'Pływalnia': 'pool',
  'Siłownia': 'weights',
  'Fitness': 'weights',
};

export function categoryIconName(categoryName) {
  return CATEGORY_TO_ICON[categoryName] || 'stadium';
}
