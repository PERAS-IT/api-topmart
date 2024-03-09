module.exports.changeDomain = (email) => {
  const atIndex = email.indexOf("@");
  const front = email.slice(0, atIndex);
  const domain = email.slice(atIndex);

  const newDomain = front.slice(0, 2) + "xxxx" + domain;
  return newDomain;
};
