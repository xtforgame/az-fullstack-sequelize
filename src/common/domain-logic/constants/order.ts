import { EnumInfo } from './base';
import { toMap } from '../../utils';

export const orderStateInfo : EnumInfo[] = [
  { id: 'unpaid', name: '未付款' },
  { id: 'paid', name: '已付款' },
  { id: 'selected', name: '待出貨' },
  { id: 'shipped', name: '已出貨' },
  { id: 'returned', name: '已退貨' },
  { id: 'expired', name: '已過期' },
];
export const orderStateNameMap = toMap<EnumInfo, string>(orderStateInfo, v => v.id, v => v.name);
export const orderStateNameFunc = id => orderStateNameMap[id] || '<不明狀態>';
export const orderStates = orderStateInfo.map(({ id, name }) => ({ id, name: name || '<不明狀態>' }));


export const orderPayWayInfo : EnumInfo[] = [
  { id: 'esun_atm', name: 'ATM' },
  { id: 'paypal', name: '信用卡(國外 - paypal)' },
  { id: 'esun', name: '信用卡' },
  { id: 'esun_trade', name: '支付寶' },
  { id: 'ibon', name: '7-11 ibon' },
  { id: 'famiport', name: '全家' },
  { id: 'liftet', name: '萊爾富' },
];
export const orderPayWayNameMap = toMap<EnumInfo, string>(orderPayWayInfo, v => v.id, v => v.name);
export const orderPayWayNameFunc = id => orderPayWayNameMap[id] || '<未選擇付款方式>';
export const orderPayWays = orderPayWayInfo.map(({ id, name }) => ({ id, name: name || '<不明狀態>' }));
