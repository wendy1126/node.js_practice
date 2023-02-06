var router = require("express").Router(); //require('파일경로') / require('라이브러리') : 다른 파일이나 라이브러리를 여기에 첨부할게요 라는 뜻

//app.get(~~)대신 router.get(~~)으로 작성
router.get("/sports", function (요청, 응답) {
  응답.send("스포츠 게시판");
});

router.get("/game", function (요청, 응답) {
  응답.send("게임 게시판");
});

//js 파일을 다른 파일에서 거져다 쓰고 싶을 때 module.exports = 내보낼 변수명; 사용
module.exports = router;
