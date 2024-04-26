class CalcError extends Error {
  constructor(msg, status) {
    super();
    this.msg = msg;
    this.status = status;
    console.error(this.stack);
  }
}

module.exports = CalcError;
