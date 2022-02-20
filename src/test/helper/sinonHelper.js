const sinon = require('sinon');

class SinonHelper {
  #counter; //private
  constructor () {
    this.#counter = 0;
    this.stub = undefined;
  }
  
  initStub(module, fn) {
    if(!this.stub) this.stub = sinon.stub(module, fn);
    return this.stub;
  }

  makeCallableCounter(){
    return this.stub.onCall(this.#counter++);
  }

  restore() {
    this.#counter = 0;
    if (this.stub) this.stub.restore();
  }

}

module.exports.SinonHelper = SinonHelper;
