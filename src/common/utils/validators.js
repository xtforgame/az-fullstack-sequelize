import validator from 'validator';

export {
  validator,
};

export function isValidPassword(value){
  const reg = /^(?=.*[a-zA-Z\d#$^+=!*()@%&])(?!.*\s).{8,128}/;
  // const lengthReg = /^.{8,128}/;
  // const noSpaceReg = /^(?!.*\s)/;
  // const validCharsReg = /^(?=.*[a-zA-Z\d#$^+=!*()@%&])/;
  return !!value && reg.test(value);
}

export function isAllDigital(value){
  const reg = /^\d+$/;
  return !!value && reg.test(value);
}

export function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // for unicode
  // const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return re.test(String(email).toLowerCase());
}
