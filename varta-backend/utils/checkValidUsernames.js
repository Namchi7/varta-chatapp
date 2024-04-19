const isInvalidUsername = (username) => {
  if (username === undefined || username?.length < 5) {
    return true;
  } else {
    return false;
  }
};

export default isInvalidUsername;
