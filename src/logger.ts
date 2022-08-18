import dayjs from "dayjs";

const getTimeStamp = () => {
    return dayjs().format("(MM/DD/YYYY) HH:mm:ss");
};

const info = (namespace: string, message: string, object?: unknown) => {
    console.log(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`, object ? object : "");
};

const warn = (namespace: string, message: string, object?: unknown) => {
    console.log(`[${getTimeStamp()}] [WARN] [${namespace}] ${message}`, object ? object : "");
};

const error = (namespace: string, message: string, object?: unknown) => {
    console.log(`[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`, object ? object : "");
};

const debug = (namespace: string, message: string, object?: unknown) => {
    console.log(`[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`, object ? object : "");
};

export default { info, warn, error, debug };
