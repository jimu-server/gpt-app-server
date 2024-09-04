import {v4 as uuidv4} from "uuid"

export function IsEmpty(value: any): boolean {
    return Object.keys(value).length == 0
}

export function format_date(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

export function debounce(fn: Function, delay: number) {
    let timer = null;
    return function (...args: any) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}


export function getTimestampDifference(value: number): string {
    // 定义一个变量，用于存储当前时间
    let now = new Date();

    // 定义一个变量，用于存储给定的消息发送的时间
    let sendTime = new Date(value);

    // 返回给定的消息发送的时间与当前时间的差异，单位为毫秒
    // @ts-ignore
    let differenceInMilliseconds = now - sendTime;

    // 如果差异小于一分钟，则返回 "刚刚"
    if (differenceInMilliseconds < 60000) {
        return "刚刚";
    }

    // 如果差异小于一小时，则返回相应的分钟数
    if (differenceInMilliseconds < 3600000) {
        return Math.floor(differenceInMilliseconds / 60000) + "分钟前";
    }

    // 如果差异小于一天，则返回相应的小时数
    if (differenceInMilliseconds < 86400000) {
        return Math.floor(differenceInMilliseconds / 3600000) + "小时前";
    }

    // 如果差异小于一周，则返回相应的天数
    if (differenceInMilliseconds < 604800000) {
        return Math.floor(differenceInMilliseconds / 86400000) + "天前";
    }

    // 如果差异小于一个月，则返回相应的周数
    if (differenceInMilliseconds < 2592000000) {
        return Math.floor(differenceInMilliseconds / 604800000) + "周前";
    }

    // 如果差异小于一年，则返回相应的月数
    if (differenceInMilliseconds < 31536000000) {
        return Math.floor(differenceInMilliseconds / 2592000000) + "月前";
    }

    // 如果差异大于一年，则返回相应的年数
    return Math.floor(differenceInMilliseconds / 31536000000) + "年前";
}

export function formatTime(timeStamp) {
    let date = new Date(timeStamp);
    let now = new Date();
    let thisYear = now.getFullYear();
    let thisMonth = now.getMonth();
    let thisDay = now.getDate();
    let thisWeek = now.getDay();
    if (thisWeek === 0) thisWeek = 7; // 让周日为一周的第七天
    let dateYear = date.getFullYear();
    let dateMonth = date.getMonth();
    let dateDay = date.getDate();
    let dateWeek = date.getDay();
    if (dateWeek === 0) dateWeek = 7; // 让周日为一周的第七天
    if (thisYear === dateYear && thisMonth === dateMonth) {
        if (thisDay === dateDay) {
            return `${date.getHours()}:${date.getMinutes()}`;
        } else if (thisDay === dateDay + 1) {
            return '昨天';
        } else if (thisWeek > dateWeek && thisDay > dateDay) {
            return ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][dateWeek - 1];
        }
    }
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}


export function getUuid(): string {
    return uuidv4()
}