import liff from '@line/liff';

export class LiffManager {
  liffId: string;

  groupId: string;

  constructor() {
    this.liffId = '1656012301-RK2Nb5nd';
    this.groupId = '';
  }

  async login() {
    if (liff.isInClient()) {
      try {
        await liff.init({ liffId: this.liffId });
        const context = liff.getContext();
        this.groupId = context?.groupId || '';
        // alert(JSON.stringify(context, null, 2));
        // // document.getElementById('output').innerHTML = 'Error';
        // document.getElementById('output').innerHTML = JSON.stringify(await liff.getProfile(), null, 2);

        // const context = liff.getContext();
        // document.getElementById('output2').innerHTML = JSON.stringify(context, null, 2);

        // // location.replace('/azadmin');
      } catch (error) {
        // alert('Error');
        // document.getElementById('output').innerHTML = 'Error';
      }
    }
  }
}

const liffManager = new LiffManager();

export default liffManager;
