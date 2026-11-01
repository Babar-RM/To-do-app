class ApiResponse{
    constructor(statusCode, message, data=null){
        this.success = true;
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
    };
};
export default ApiResponse;