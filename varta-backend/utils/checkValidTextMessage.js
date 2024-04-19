const isInvalidTextMessage = (text) => {
  if (text === undefined || text?.trim()?.length === 0) {
    return true;
  } else {
    return false;
  }
};

export default isInvalidTextMessage;
