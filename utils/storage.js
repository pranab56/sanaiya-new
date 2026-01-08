export const saveToken = (token) => {
  localStorage.setItem("catAdmin", token);
};

export const getToken = () => {
  return localStorage.getItem("catAdmin");
};

export const removeToken = () => {
  localStorage.removeItem("catAdmin");
};
