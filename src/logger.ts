import dayjs from "dayjs";

const getTimeStamp = () => {
    return dayjs().format("(MM/DD/YYYY) HH:mm:ss");
};

const info = (namespace: string, message: string, object?: any) => {
    if (object) console.log(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`, object);
    else console.log(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`);
};

const warn = (namespace: string, message: string, object?: any) => {
    if (object) console.log(`[${getTimeStamp()}] [WARN] [${namespace}] ${message}`, object);
    else console.log(`[${getTimeStamp()}] [WARN] [${namespace}] ${message}`);
};

const error = (namespace: string, message: string, object?: any) => {
    if (object) console.log(`[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`, object);
    else console.log(`[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`);
};

const debug = (namespace: string, message: string, object?: any) => {
    if (object) console.log(`[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`, object);
    else console.log(`[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`);
};

export default { info, warn, error, debug };
