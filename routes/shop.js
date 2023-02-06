var router = require("express").Router(); //require('파일경로') / require('라이브러리') : 다른 파일이나 라이브러리를 여기에 첨부할게요 라는 뜻

// /shop 접속 전 실행할 미들웨어
function 로그인했니(요청, 응답, next) {
  if (요청.user) {
    next();
  } else {
    응답.send("로그인 안했습니다.");
  }
}

//app.get(~~)대신 router.get(~~)으로 작성
//로그인 한 사람만 방문가능하게 미들웨어 적용하고 싶으면, 2번째에 함수 적으면됨
router.get("/shirts", 로그인했니, function (요청, 응답) {
  응답.send("셔츠 파는 페이지입니다.");
});

router.get("/pants", 로그인했니, function (요청, 응답) {
  응답.send("바지 파는 페이지입니다.");
});

//js 파일을 다른 파일에서 거져다 쓰고 싶을 때 module.exports = 내보낼 변수명; 사용
module.exports = router;
