
export const campaignTypeInfo = [
  { id: 'seasonal', name: '季節活動' },
  { id: 'discount-basic', name: '一般折扣/免運' },
  { id: 'discount-total-price', name: '滿額折扣/免運' },
  { id: 'discount-total-amount', name: '滿量折扣/免運' },
  { id: 'freebie-total-price', name: '滿額贈品' },
];
export const campaignTypeNameMap = campaignTypeInfo.reduce((m, v) => ({ ...m, [v.id]: v.name }), {});
export const campaignTypeNameFunc = id => campaignTypeNameMap[id] || '<不明狀態>';
export const campaignTypes = campaignTypeInfo.map(({ id, name }) => ({ id, name: name || '<不明狀態>' }));

// =========================================

export const campaignStateInfo = [
  { id: 'actived', name: '開啟' },
  { id: 'deactivated', name: '關閉' },
];
export const campaignStateNameMap = campaignStateInfo.reduce((m, v) => ({ ...m, [v.id]: v.name }), {});
export const campaignStateNameFunc = id => campaignStateNameMap[id] || '<不明狀態>';
export const campaignStates = campaignStateInfo.map(({ id, name }) => ({ id, name: name || '<不明狀態>' }));
