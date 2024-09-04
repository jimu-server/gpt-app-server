export enum ToolLayout {
    // 左侧工具栏
    Left = 1,
    // 右侧工具栏
    Right = 2
}

export enum ToolBtnType {
    // 路由类型工具按钮(没有自定义的工具侧边窗口)
    ToolRouteBtn = 1,
    // 窗口工具按钮组(有自定义的工具侧边窗口)
    ToolWindowBtn = 2
}
export enum Platform {
    Desktop = 'Electron',
    Web = 'Web'
}
