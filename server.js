const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect(
  'mongodb+srv://kbb9278:<qhqo1126%21>@cluster0.z4k54lg.mongodb.net/todoapp?retryWrites=true&w=majority',
  function (에러, client) {
    app.listen(8080, function () {
      console.log('listening on 8080');
    });
  }
);

//서버로 get요청 처리
//누군가 /pet 으로 방문하면 pet 관련된 안내문을 띄워주자
app.get('/pet', function (요청req, 응답res) {
  응답res.send('펫용품 쇼핑 페이지임');
});

app.get('/beauty', function (요청req, 응답res) {
  응답res.send('뷰티용품 쇼핑 페이지임');
});

//html 파일 보내기
app.get('/', function (요청req, 응답res) {
  응답res.sendFile(__dirname + '/index.html');
});

app.get('/write', function (요청req, 응답res) {
  응답res.sendFile(__dirname + '/write.html');
});

//어떤사람이 /add경로로 POST 요청하면 send 해주세요
app.post('/add', function (요청req, 응답res) {
  응답res.send('전송완료');
  console.log(요청req.body.title);
  console.log(요청req.body.date);
});
