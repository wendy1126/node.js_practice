const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const MongoClient = require('mongodb').MongoClient; //DB접속(connect)하기 위해 작성
app.set('view engine', 'ejs'); //ejs 쓰겠다고 등록

var db; //어떤 폴더에 DB를 저장할 것인지 명시 필요, 변수 하나 필요
MongoClient.connect(
  //DB Access 메뉴에서 만든 아이디, 비번 입력필요(비번 특수문자는 변환 필요)
  //connect는 연결해주세요고, function은 연결되면 실행할 내용들
  'mongodb+srv://kbb9278:qhqo1126%21@cluster0.z4k54lg.mongodb.net/todoapp?retryWrites=true&w=majority',
  function (에러, client) {
    if (에러) return console.log(에러); //'에러' 파라미터는, 에러 발생 시 어떤 에러인지 알려주는 역할 파라미터

    db = client.db('todoapp'); //todoapp이라는 DB(폴더)에 연결 해주세요

    db.collection('post').insertOne(
      //post라는 collection을 가져와서 데이터 하나를 저장해주세요
      //insertOne(저장하고싶은 데이터,콜백함수(그 후 실행할 코드))
      { 이름: 'john', 나이: 20, _id: 100 },
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
// app.post('/add', function (요청req, 응답res) {
//   응답res.send('전송완료');
//   console.log(요청req.body.title);
//   console.log(요청req.body.date);
// });

//어떤 사람이 /add 라는 경로로 post 요청을 하면,
//데이터 2개(날짜,제목)를 보내주는데,
//이 때, 'post'라는 이름을 가진 collection에 2개 데이터를 저장하기
//{제목: '어쩌구', 날짜:'어쩌구'}
app.post('/add', function (요청req, 응답res) {
  응답res.send('전송완료');
  db.collection('post').insertOne(
    { 제목: 요청req.body.title, 날짜: 요청req.body.date },
    function () {
      console.log('저장완료');
    }
  );
});

// /list로 GET요청으로 접속하면
//실제 DB에 저장된 데이터들로 예쁘게 꾸며진 HTML(말고 .ejs파일)을 보여줌
app.get('/list', function (요청, 응답) {
  db.collection('post').find(); //post라는 이름의 collection에 있는 모든 데이터를 f
  가져옴;
  응답.render('list.ejs');
  //DB에 저장된 post라는 이름을 collection안의 모든 데이터(ex.id가 뭐인 데이터/제목이 뭐인 데이터)를 꺼내주세요
});
