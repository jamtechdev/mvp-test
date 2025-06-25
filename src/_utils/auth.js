import users from "../_data/user.json";

export const loginUser = (email, password) => {
  return users.find(
    (user) => user.email === email && user.password === password
  );
};

export const registerUser = (email, password) => {
  const exists = users.find((user) => user.email === email);
  if (exists) return null;
  const newUser = { id: Date.now(), email, password };
  // Only for simulation; cannot write in JSON from frontend.
  return newUser;
};
