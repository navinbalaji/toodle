export const successResponseModel = (message = null, data = null) => {
  return {
    isSuccess: true,
    message,
    data,
    error: null,
  };
};

export const failureResponseModel = (message = null, data = null) => {
  return {
    isSuccess: false,
    message,
    data,
    error: null,
  };
};
