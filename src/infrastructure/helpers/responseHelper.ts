export const successResponse = (data: any, message = 'Éxito', statusCode = 200) => {
    return {
      statusCode,
      message,
      data,
    };
  };
  
  export const errorResponse = (message = 'Error', statusCode = 400) => {
    return {
      statusCode,
      message,
      data: null,
    };
  };
  