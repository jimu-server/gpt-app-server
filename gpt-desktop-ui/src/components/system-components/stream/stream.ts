import {hasOwnProperty} from "@/components/system-components/utils/systemutils";

/*
* @description: 消息处理器
* @param data 流消息
* @param status 业务状态码
* */
export type handler = (data: any, status: number) => void;

export type check = (data: any) => boolean;

export enum StreamStatus {
    // 成功
    SUCCESS = 200,
    // 取消
    CANCEL = 201,
    // 正常结束
    STOP = 202,
    // 非流式数据
    RESPONSE = 203,
    COMPLETE = 204,

    // 解析错误
    ERROR = 501,

}

export class Stream {
    private response: Response;

    /*
    * @description: 流消息处理器,任何有效的流消息在结束之前都会调用 handler 处理器
    * */
    protected handler: handler = (data: any, status: number) => {
        console.log("default stream handler")
    };

    /*
    * @description: 流消息遇到了后端的非流式业务响应状态导致结束会调用 end 处理器
    * */
    protected end: handler = (data: any, status: number) => {
        console.log("default stream end")
    };

    /*
    * @description: 流消息正常完成处理,正常完成包括一下 正常读取完成,人为手动取消
    * */
    protected complete: handler = (data: any, status: number) => {
        console.log("default stream end")
    };
    // 流消息错误处理器
    protected err: handler = (data: any, status: number) => {
        console.error(status, data)
    };

    /*
    * @description: 检查消息是否是流消息,如果检查返回了 true 则为非流消息,当前可能遇到了 标准业务响应数据,此时会调用 end 处理器
    * */
    checkData: check = (data: any) => {
        let code = hasOwnProperty(data, "code");
        let msg = hasOwnProperty(data, "msg");
        let err = hasOwnProperty(data, "data");
        return code && msg && err
    }

    protected stop: boolean = false;

    constructor(response: Response) {
        this.response = response;
    }

    public setHandler(handler: handler) {
        this.handler = handler
    }

    public setEnd(end: handler) {
        this.end = end
    }

    public setComplete(complete: handler) {
        this.complete = complete
    }

    public setErr(err: handler) {
        this.err = err
    }

    public Stop() {
        this.stop = true;
    }


    public async listen() {
        const reader = this.response.body.getReader()
        const decoder = new TextDecoder('utf-8')
        try {
            while (true) {
                // 手动停止
                if (this.stop) {
                    await reader.cancel()
                    // 执行结束
                    this.complete(null, StreamStatus.STOP)
                    return
                }
                const {done, value} = await reader.read()
                if (done) {
                    break
                }
                let decodedData = decoder.decode(value);
                let accumulatedData = ""
                accumulatedData += decodedData
                for (const line of accumulatedData.split('\n')) {
                    if (line) {
                        try {
                            let parsed = JSON.parse(line)
                            if (this.checkData(parsed)) {
                                this.end(parsed, StreamStatus.RESPONSE)
                                return
                            }
                            // 正常流消息处理
                            this.handler(parsed, StreamStatus.SUCCESS)
                        } catch (error) {
                            this.err(error, StreamStatus.ERROR)
                            return
                        }
                    }
                }
            }
        } catch (e) {
            this.err(e, StreamStatus.ERROR)
            return
        }
        this.stop = false
        // 正常结束
        this.complete(null, StreamStatus.COMPLETE)
    }
}