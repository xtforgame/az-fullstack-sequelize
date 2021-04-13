
export const productGroupTypeInfo = [
  { id: 'seasonal', name: '季節活動' },
  { id: 'permanent-discount', name: '折扣' },
  { id: 'discount-total-price', name: '滿額折扣' },
  { id: 'free-shipping-total-price', name: '滿額免運' },
  { id: 'free-shipping-total-amount', name: '滿量免運' },
];
export const productGroupTypeNameMap = productGroupTypeInfo.reduce((m, v) => ({ ...m, [v.id]: v.name }), {});
export const productGroupTypeNameFunc = id => productGroupTypeNameMap[id] || '<不明狀態>';
export const productGroupTypes = productGroupTypeInfo.map(({ id, name }) => ({ id, name: name || '<不明狀態>' }));

// =========================================

export const productGroupStateInfo = [
  { id: 'na', name: '<N/A>' },
  { id: 'actived', name: '連線' },
  { id: 'past_actived', name: '過季連線' },
  { id: 'in_store', name: '店內' },
  { id: 'expired', name: '過期(上架不可選)' },
  { id: 'hide', name: '隱藏(前端不顯示)' },
];
export const productGroupStateNameMap = productGroupStateInfo.reduce((m, v) => ({ ...m, [v.id]: v.name }), {});
export const productGroupStateNameFunc = id => productGroupStateNameMap[id] || '<不明狀態>';
export const productGroupStates = productGroupStateInfo.map(({ id, name }) => ({ id, name: name || '<不明狀態>' }));
