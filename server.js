const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true })); //mongoDB 접속하기 위해 작성1
const MongoClient = require("mongodb").MongoClient; //mongoDB 접속하기 위해 작성2
app.set("view engin", "ejs"); //ejs 사용하기 위해 작성
const methodOverride = require("method-override"); //put과 delete 요청할 수 있는 라이브러리 method-override 쓰기 위해 작성
app.use(methodOverride("_method")); //put과 delete 요청할 수 있는 라이브러리 method-override 쓰기 위해 작성
const passport = require("passport"); //session방식 로그인 기능 구현하기 위한 라이브러리1
const LocalStrategy = require("passport-local").Strategy; //session방식 로그인 기능 구현하기 위한 라이브러리2
const session = require("express-session"); //session방식 로그인 기능 구현하기 위한 라이브러리3
require("dotenv").config(); //환경변수 사용을 위한 라이브러리

//app.user(미들웨어) : 웹서버는 요청-응답해주는 머신이기때문에 중간에 실행되는 코드를 미들웨어라고 함
app.use(
  session({ secret: "비밀코드", resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/public", express.static("public")); //내가 작성한 css 파일 첨부하기 위해 작성

var db;
//mongoDB connect에서 복붙 (아이디,비밀번호,프로젝트이름 확인 필수:비번에 특수문자는 변환필요)
MongoClient.connect(
  //접속해주세요라고 요청하는 곳이고
  process.env.DB_URL,
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

    app.listen(process.env.PORT, function () {
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

//서버에서 query string 꺼내는 법(1)
// app.get("/search", (요청, 응답) => {
//   console.log(요청.query.value); //query string이 담겨있음. value는 검색한 단어임
//   db.collection("post")
//     .find({ 제목: 요청.query.value })
//     .toArray((에러, 결과) => {
//       console.log(결과);
//       응답.render("search.ejs", { posts: 결과 });
//     });
// });

// 일부 일치하면 검색 가능하도록, '정규식(문자검사하는식)' 쓰면 되지만 임시방편임. find(/정규식/)은 시간이 오래걸리기도함
// 정규식 대신 'indexing' 을 사용. 미리 정렬(indexing)
// index : 기존 collection을 정렬해놓은 사본(mongoDB->Collections-indexes->CREATE INDEX)
// 미리 indexing(정렬)해두면 BD는 알아서 Binary Search 해줌

//서버에서 query string 꺼내는 법(2)
// app.get("/search", (요청, 응답) => {
//   // new Date();
//   db.collection("post")
//     .find({ $text: { $search: 요청.query.value } })
//     .toArray((에러, 결과) => {
//       console.log(결과);
//       응답.render("search.ejs", { posts: 결과 });
//     });
// });

//서버에서 query string 꺼내는 법(3)
app.get("/search", (요청, 응답) => {
  var 검색조건 = [
    {
      $search: {
        index: "titleSearch",
        text: {
          query: 요청.query.value,
          path: "제목", // 제목날짜 둘다 찾고 싶으면 ['제목', '날짜']
        },
      },
    },
    { $project: { 제목: 1, _id: 0, score: { $meta: "searchScore" } } }, //1은 가져오고, 0은 안가져온다는 뜻, score는 검색어와 얼마나 관련있는지 점수로 매김
    // { $sort: { _id: 1 } }, //id를 오름차순으로 정렬
    // { $limit: 10 }, //검색 갯수 제한걸기
  ];
  console.log(요청.query);
  db.collection("post")
    .aggregate(검색조건)
    .toArray((에러, 결과) => {
      console.log(결과);
      응답.render("search.ejs", { posts: 결과 });
    });
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

//로그인 페이지 접속
app.get("/login", function (요청, 응답) {
  응답.render("login.ejs");
});

//서버가 로그인 요청 시...
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/fail",
  }),
  function (요청, 응답) {
    //로그인 성공 시 처리하는 코드
    응답.redirect("/");
  }
);

//마이페이지 만들기
app.get("/mypage", 로그인했니, function (요청, 응답) {
  console.log(요청.user);
  응답.render("mypage.ejs", { 사용자: 요청.user });
});

//mypage 접속 전 실행할 미들웨어
function 로그인했니(요청, 응답, next) {
  if (요청.user) {
    next();
  } else {
    응답.send("로그인 안했습니다.");
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: "id",
      passwordField: "pw",
      session: true, //세션을 저장할 것인지
      passReqToCallback: false,
    },
    //아이디/비번 맞는 지 DB와 비교 검증하는 부분
    function (입력한아이디, 입력한비번, done) {
      console.log(입력한아이디, 입력한비번);
      db.collection("login").findOne(
        { id: 입력한아이디 },
        function (에러, 결과) {
          if (에러) return done(에러);
          //밑에부터 아주 중요
          //done은 3개의 파라미터를 가질 수 있음 : done(서버에러, 성공시 사용자 DB데이터, 에러메세지)
          if (!결과)
            return done(null, false, { message: "존재하지않는 아이디요" });
          if (입력한비번 == 결과.pw) {
            return done(null, 결과); //'결과'는 아이디 비번 검증 성공시 아래의 user에 들어감
          } else {
            return done(null, false, { message: "비번틀렸어요" });
          }
        }
      );
    }
  )
);

// 세션만들기, 로그인 성공->세션정보 만듦->마이페이지 방문시 세션검사
// user.id를 이용해서 세션을 저장시키는 코드(로그인 성공시 발동)
passport.serializeUser(function (user, done) {
  //검증 코드의 '결과'가 user에 저장돔
  done(null, user.id); //세션 데이터를 만들고 세션의 id 정보를 쿠키로 보냄
});

//로그인한 유저의 세션아이디를 바탕으로 개인정보를 DB에서 찾는 역할(마이페이지 접속시 발동)
passport.deserializeUser(function (아이디, done) {
  //위 코드의 user.id가 '아이디'와 동일
  //db에서 위에 있는 user.id로 유저를 찾은 뒤에 유저 정보를 중괄호 안에 넣음(user의 DB를 마이페이지에서 출력해주려고)
  db.collection("login").findOne({ id: 아이디 }, function (에러, 결과) {
    done(null, 결과);
  });
});

//회원가입 만들기
app.post("/register", function (요청, 응답) {
  db.collection("login").insertOne(
    { id: 요청.body.id, pw: 요청.body.pw },
    function (에러, 결과) {
      응답.redirect("/");
    }
  );
});
