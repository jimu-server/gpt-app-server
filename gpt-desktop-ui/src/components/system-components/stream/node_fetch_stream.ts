import {Stream, StreamStatus} from "@/components/system-components/stream/stream";
import {Response} from "node-fetch";

const AbortController = require('abort-controller');

export class NodeFetchStream extends Stream {
    private resp: Response;

    private controller: AbortController;

    constructor(response: Response, controller: AbortController) {
        super(null)
        this.resp = response;
        this.controller = controller;
    }

    public async listen() {
        try {
            const decoder = new TextDecoder('utf-8')
            for await (const chunk of this.resp.body) {
                if (this.stop) {
                    this.controller.abort()
                    // 执行结束
                    this.complete(null, StreamStatus.STOP)
                    return
                }
                let value = chunk.toString();
                for (const line of value.split('\n')) {
                    console.log(line)
                    if (line) {
                        let parse = JSON.parse(line);
                        if (this.checkData(parse)) {
                            this.end(value, StreamStatus.RESPONSE)
                            return
                        }
                        // 正常流消息处理
                        this.handler(parse, StreamStatus.SUCCESS)
                    }
                }
            }
        } catch (err) {
            this.err(err.stack, StreamStatus.ERROR)
        }
        this.stop = false
        // 正常结束
        this.complete(null, StreamStatus.COMPLETE)
    }
}