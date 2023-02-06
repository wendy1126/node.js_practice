const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true })); //mongoDB 접속하기 위해 작성1
const MongoClient = require("mongodb").MongoClient; //mongoDB 접속하기 위해 작성2
app.set("view engin", "ejs"); //ejs 사용하기 위해 작성
const methodOverride = require("method-override"); //put과 delete 요청할 수 있는 라이브러리 method-override 쓰기 위해 작성
app.use(methodOverride("_method")); //put과 delete 요청할 수 있는 라이브러리 method-override 쓰기 위해 작성

app.use("/public", express.static("public")); //내가 작성한 css 파일 첨부하기 위해 작성

var db;
//mongoDB connect에서 복붙 (아이디,비밀번호,프로젝트이름 확인 필수:비번에 특수문자는 변환필요)
MongoClient.connect(
  //접속해주세요라고 요청하는 곳이고
  "mongodb+srv://wendy1126:godnjs1126@cluster0.pvfkvnu.mongodb.net/?retryWrites=true&w=majority",
  function (에러, client) {
    //연결되면 할 일
    if (에러) return console.log(에러);
    db = client.db("todoapp");

    // db.collection("post").insertOne(
    //   { 이름: "John", _id: 100 },
    //   function (에러, 결과) {
    //     console.log("저장완료");
    //   }
    // );

    app.listen(8080, function () {
      console.log("listening on 8080");
    });
  }
);

//서버로 get요청 처리
//누군가 /pet 으로 방문하면 pet 관련된 안내문을 띄워주자
// app.get("/pet", function (요청req, 응답res) {
//   응답res.send("펫용품 쇼핑 페이지임");
// });

// app.get("/beauty", function (요청req, 응답res) {
//   응답res.send("뷰티용품 쇼핑 페이지임");
// });

//html 파일 보내기
app.get("/", function (요청req, 응답res) {
  // 응답res.sendFile(__dirname + "/index.ejs"); html 파일 불러오기
  응답res.render("index.ejs"); //ejs 파일 랜더링하기
});

app.get("/write", function (요청req, 응답res) {
  // 응답res.sendFile(__dirname + "/write.ejs"); html 파일 불러오기
  응답res.render("write.ejs"); //ejs 파일 랜더링하기
});

//어떤사람이 /add경로로 POST 요청하면 send 해주세요
// app.post("/add", function (요청req, 응답res) {
//   응답res.send("전송완료");
//   console.log(요청req.body.title);
//   console.log(요청req.body.date);
// });

//어떤 사람이 /add 라는 경로로 post 요청하면
//데이터 2개(날짜,제목)를 보내주는데
//이때, 'post'라는 이름을 가진 collection에 데이터 두개를 저장하기
//{제목:'어쩌구', 날짜:'어쩌구'}
app.post("/add", function (요청req, 응답res) {
  응답res.send("전송완료");
  // console.log(요청req.body.title);
  // console.log(요청req.body.date);
  db.collection("counter").findOne(
    { name: "게시물갯수" },
    function (에러, 결과) {
      console.log(결과.totalPost);
      var 총게시물갯수 = 결과.totalPost;

      db.collection("post").insertOne(
        {
          _id: 총게시물갯수 + 1,
          제목: 요청req.body.title,
          날짜: 요청req.body.date,
        }, //원하는 데이터
        function () {
          console.log("저장완료");
          //counter라는 콜렉션에 있는 totalPost라는 항목도 1 증가시켜야함(수정)
          //db.collection('counter').updateOne({어떤데이터를 수정할지},{$연산자:{수정값}},function(){})
          db.collection("counter").updateOne(
            { name: "게시물갯수" },
            { $inc: { totalPost: 1 } },
            function (에러, 결과) {
              if (에러) {
                return console.log(에러);
              }
            }
          );
        }
      );
    }
  );
});

// /list로 GET요청으로 접속하면
// 실제 DB에 저장된 데이터들로 예쁘게 꾸며진 HTML을 보여줌
app.get("/list", function (요청, 응답) {
  // DB에 저장된 post라는 collection안의 모든(or ID가 뭐인, 제목이 뭐인) 데이터를 꺼내주세요
  db.collection("post")
    .find()
    .toArray(function (에러, 결과) {
      console.log(결과);
      응답.render("list.ejs", { posts: 결과 });
    }); //모든 데이터 가져옴
});

// /delete경로로 DELETE요청 처리하는 코드
app.delete("/delete", function (요청, 응답) {
  console.log(요청.body);
  요청.body._id = parseInt(요청.body._id); //문자로 변환된 것을 숫자로 변환시킴
  //요청.body에 담겨온 게시물번호를 가진 글을 db에서 찾아서 삭제해주세요
  db.collection("post").deleteOne(요청.body, function (에러, 결과) {
    console.log("삭제완료"); //터미널창에 '삭제완료' 출력
    응답.status(200).send({ message: "성공했습니다" });
  });
});

// /detail/url파라미터 로 GET 요청하면 detail.ejs 보여줌
app.get("/detail/:id", function (요청, 응답) {
  db.collection("post").findOne(
    { _id: parseInt(요청.params.id) },
    function (에러, 결과) {
      console.log(결과);
      응답.render("detail.ejs", { data: 결과 });
    }
  );
});

//edit 페이지 만들기
app.get("/edit/:id", function (요청, 응답) {
  db.collection("post").findOne(
    { _id: parseInt(요청.params.id) },
    function (에러, 결과) {
      console.log(결과);
      응답.render("edit.ejs", { post: 결과 });
    }
  );
});

//서버로 PUT 요청 들어오면 게시물 수정 처리하기
app.put("/edit", function (요청, 응답) {
  //폼에 담긴 제목 데이터, 날짜 데이터를 가지고, db.collection에 업데이트함, parseInt(요청.body.id)=요청.body.input의 name이 id 인 것
  db.collection("post").updateOne(
    { _id: parseInt(요청.body.id) },
    { $set: { 제목: 요청.body.title, 날짜: 요청.body.date } },
    function (에러, 결과) {
      console.log("수정완료");
      응답.redirect("/list");
    }
  );
});
