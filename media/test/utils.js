const sinon = require("sinon");

const mockResponse = (...statusCode) => {
  const res = {};
  if ( statusCode !== undefined ) res.statusCode = statusCode;
  res.status = sinon.fake.returns(res);
  res.json = sinon.fake.returns(res);
  return res;
}

module.exports = {
  mockResponse,
}
