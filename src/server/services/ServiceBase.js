export default class ServiceBase {
  start(containerInterface) {
    console.log('==== start service ==== :', this.constructor.$name);
    return Promise.resolve()
    .then(() => {
      return this.onStart && this.onStart(containerInterface);
    });
  }
}
