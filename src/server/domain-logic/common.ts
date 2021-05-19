import { sha512gen_salt, crypt } from 'az-authn-kit-v2';


export const hashPassword : (s: string) => string = (plainPassword: string) => {
  return crypt(plainPassword, sha512gen_salt());
};

export const comparePasswordHash : (s1: string, s2: string) => boolean = (plainPassword: string, passwordHash: string) => {
  return crypt(plainPassword, passwordHash) === passwordHash;
};


// import bcrypt from 'bcrypt';

// const saltRounds = 10;

// export const hashPassword : (s: string) => string = (plainPassword: string) => {
//   return bcrypt.hashSync(plainPassword, saltRounds);
// };

// export const comparePasswordHash : (s1: string, s2: string) => boolean = (plainPassword: string, passwordHash: string) => {
//   return bcrypt.compareSync(plainPassword, passwordHash);
// };

// const myPassword = 'password1';
// const myHash ='$2a$10$fok18OT0R/cWoR0a.VsjjuuYZV.XrfdYd5CpDWrYkhi1F0i8ABp6e';

// const result = bcrypt.compareSync(myPassword, myHash);
// console.log('result :', result);

