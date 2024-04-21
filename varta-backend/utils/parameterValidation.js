export const isInvalidUsername = (username) => {
  if (username === undefined || username?.length < 5) {
    return true;
  } else {
    return false;
  }
};

export const isInvalidPassword = (password) => {
  if (password === undefined || password?.trim()?.length < 5) {
    return true;
  } else {
    return false;
  }
};

export const isInvalidName = (name) => {
  if (name === undefined || name?.trim()?.length === 0) {
    return true;
  } else {
    return false;
  }
};

export const isInvalidTextMessage = (text) => {
  if (text === undefined || text?.trim()?.length === 0) {
    return true;
  } else {
    return false;
  }
};
