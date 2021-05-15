import { EnumInfo } from './base';
import { toMap } from '../../utils';


export const campaignTypeInfo : EnumInfo[] = [
  { id: 'seasonal', name: '季節活動' },
  { id: 'discount-basic', name: '一般折扣/免運' },
  { id: 'discount-total-price', name: '滿額折扣/免運' },
  { id: 'discount-total-amount', name: '滿量折扣/免運' },
  { id: 'freebie-total-price', name: '滿額贈品' },
  { id: 'custom-made-classic', name: '自訂款(常賣款)' },
  { id: 'custom-made-limited', name: '自訂款(限定款)' },
];
export const campaignTypeNameMap = toMap<EnumInfo, string>(campaignTypeInfo, v => v.id, v => v.name);
export const campaignTypeNameFunc = id => campaignTypeNameMap[id] || '<不明狀態>';
export const campaignTypes = campaignTypeInfo.map(({ id, name }) => ({ id, name: name || '<不明狀態>' }));

// =========================================

export const campaignStateInfo : EnumInfo[] = [
  { id: 'actived', name: '開啟' },
  { id: 'deactivated', name: '關閉' },
];
export const campaignStateNameMap = toMap<EnumInfo, string>(campaignStateInfo, v => v.id, v => v.name);
export const campaignStateNameFunc = id => campaignStateNameMap[id] || '<不明狀態>';
export const campaignStates = campaignStateInfo.map(({ id, name }) => ({ id, name: name || '<不明狀態>' }));
