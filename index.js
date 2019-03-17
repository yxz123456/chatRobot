const http = require('http')
const fs = require('fs')
const url = require('url')
const req = require('request')

http.createServer(function(request,response){
    let pathName = url.parse(request.url).pathname
    let params = url.parse(request.url,true).query
    //如果请求的是静态文件
    if(isStaticRequest(pathName)){
        try{
            let data = fs.readFileSync('./page' + pathName)
            response.writeHead(200)
            response.write(data)
            response.end()
        }
        catch (e) {
            response.writeHead(404)
            response.write('<html><body><h1>404 NotFound</h1></body></html>')
            response.end()
        }
    }
    //如果请求的是信息
    else{
        if(pathName == '/api/chat'){
            let data = {
                "reqType":0,
                "perception": {
                    "inputText": {
                        "text": params.text
                    },
                },
                "userInfo": {
                    "apiKey": "da615fe994b746ec80833672248d5c46",
                    "userId": "123456"
                }
            }
            req({
                url: 'http://openapi.tuling123.com/openapi/api/v2',
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            },function(err,res,body){
                let resData = JSON.parse(body).results[0].values
                response.writeHead(200)
                response.write(JSON.stringify(resData))
                response.end()
            })
        }
    }
}).listen(12306)

function isStaticRequest(pathName){
    let staticFile = ['.html','.css','.js','.jpg','.png','.jpeg','.gif']
    for(let i = 0; i < staticFile.length; i ++){
        if(pathName.indexOf(staticFile[i]) == pathName.length - staticFile[i].length){
            return true
        }
    }
    return false
}