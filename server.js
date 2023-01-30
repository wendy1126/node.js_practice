const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const MongoClient = require('mongodb').MongoClient; //DB접속(connect)하기 위해 작성

var db; //어떤 폴더에 DB를 저장할 것인지 명시 필요, 변수 하나 필요
MongoClient.connect(
  //DB Access 메뉴에서 만든 아이디, 비번 입력필요(비번 특수문자는 변환 필요)
  //connect는 연결해주세요고, function은 연결되면 실행할 내용들
  'mongodb+srv://kbb9278:qhqo1126%21@cluster0.z4k54lg.mongodb.net/todoapp?retryWrites=true&w=majority',
  function (에러, client) {
    if (에러) return console.log(에러); //'에러' 파라미터는, 에러 발생 시 어떤 에러인지 알려주는 역할 파라미터

    db = client.db('todoapp'); //todoapp이라는 DB(폴더)에 연결 해주세요

    db.collection('post').insertOne(
      { 이름: 'john', 나이: 20 },
      function (에러, 결과) {
        console.log('저장완료');
      }
    );

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
