import data from "@/assets/icons/iconfont.json"

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


export function formatTime(timeStamp) {
    let date = new Date(timeStamp);
    return getConversationLastTime(date);
}

export function getConversationLastTime(sendTime: Date) {
    let now = new Date();
    // console.log(`${sendTime.getFullYear() + '-' + sendTime.getMonth() + '-' + sendTime.getDate() + " " + sendTime.getUTCHours() + ':' + sendTime.getUTCMinutes()}`)
    let y: any = sendTime.getUTCFullYear()
    let m: any = sendTime.getUTCMonth()
    let d: any = sendTime.getUTCDate()
    let hh: any = sendTime.getUTCHours()
    let mm: any = sendTime.getUTCMinutes()
    let ss: any = sendTime.getUTCSeconds()

    let ny: any = sendTime.getUTCFullYear()
    let nm: any = sendTime.getUTCMonth()
    let nd: any = sendTime.getUTCDate()
    let week: any = sendTime.getUTCDay()
    let weekValue: any = ''


    if (ny == y && nm == m && nd == d) {
        if (hh < 10) {
            hh = '0' + hh
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        return `${hh + ':' + mm}`
    }

    switch (week) {
        case 0:
            weekValue = '周日'
            break
        case 1:
            weekValue = '周一'
            break
        case 2:
            weekValue = '周二'
            break
        case 3:
            weekValue = '周三'
            break
        case 4:
            weekValue = '周四'
            break
        case 5:
            weekValue = '周五'
            break
        case 6:
            weekValue = '周六'
            break
    }

    if (nd - d == 1) {
        return '昨天'
    }
    if (nd - d > 7) {
        if (m < 10) {
            m = '0' + m
        }
        if (d < 10) {
            d = '0' + d
        }
        return `${y + '-' + m + '-' + d}`
    }
    if (nd - d > 1) {
        return weekValue
    }
}


/*
* @description: 加载系统图标
* */
export function getIcon() {
    let arr = []
    let prefix = 'icon iconfont ' + data.css_prefix_text
    data.glyphs.forEach(item => {
        arr.push({
            name: item.name,
            q_icon: item.font_class,
            el_icon: prefix + item.font_class,
            class: data.css_prefix_text + item.font_class
        })
    })
    return arr
}

export function hasOwnProperty(obj: object, prop: string) {
    return obj.hasOwnProperty(prop);
}

