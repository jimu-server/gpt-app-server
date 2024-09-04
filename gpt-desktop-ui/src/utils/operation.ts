export function GetOperationID (){
    let id = Date.now()
    let operationID = id.toString()
    return operationID
}