
// 手机号码验证
export const isvalidPhone = (str) =>{
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
    return reg.test(str)
};

export const checkPhone = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('请输入手机号码'));
    }else if(!isvalidPhone(value)){
        return callback(new Error('请输入正确的11位手机号码'))
    }else{
        callback()
    }
};



