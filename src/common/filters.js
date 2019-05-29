const formatEmpty = (value, format = '-') => {
    if(value === null) return format;
    if((typeof value).toString().toLowerCase() === 'string'){
        if(value.trim().length === 0) return format;
    }
    if(Array.isArray(value)){
        if(value.length === 0) return format;
    }
    return value;
};

export {formatEmpty}