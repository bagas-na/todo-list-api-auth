export const hashPassword = async (password: string, salt: string) => {
  const hashInput = `${password}${salt}`;

  return await Bun.password.hash(hashInput, {
    // values as recomended in https://thecopenhagenbook.com/password-authentication#password-storage
    algorithm: "argon2id",
    memoryCost: 19456, // 19 MiB
    timeCost: 2,
  });
};

export const verifyPassword = async (password: string, salt: string, passwordHash: string) => {
  const hashInput = `${password}${salt}`;
  return await Bun.password.verify(passwordHash, hashInput);
};
