import {useNotifyStore} from "@/components/system-tool/notifyTool/store/notify";
import pina from "@/pinia";
import {deleteNotify, getAllNotify, readNotify} from "@/components/system-tool/notifyTool/notifyRequest";


export async function readMsg(id: string) {
    let result = await readNotify(id)
    const notify = useNotifyStore(pina)
    if (result.code == 200) {
        notify.list = await getAllNotify()
    }
}

export async function readMsgElNotifyOption(id: string, callback: () => void) {
    let result = await readNotify(id)
    const notify = useNotifyStore(pina)
    if (result.code == 200) {
        notify.list = await getAllNotify()
    }
    callback()
}


export async function delMsg(id: string) {
    let result = await deleteNotify(id)
    const notify = useNotifyStore(pina)
    if (result.code == 200) {
        notify.list = await getAllNotify()
    }
}