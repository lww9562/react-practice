

app.get('/authcheck', (req, res) => {
    const sendData = { isLogin : ""};

    sendData.isLogin = "False"
    res.send(sendData);
})


app.post("/login", (req, res) => {
    const username = req.body.userId;
    const password = req.body.userPw;

    const sendData = { isLogin : ""};

    if(username && password) {
        db.query('select * from userinfo where userid=?', [username], function(error, results, fields) {
            console.log(results);
            console.log('===============')
            console.log(results[0]);
            if(error) throw error;
            if (results.length > 0) {
                bcrypt.compare(password, results[0].USERPW, (err, result) => {
                    if(result === true) { 
                        //세션 처리 필요
                        sendData.isLogin = "True";
                        res.send(sendData);
                    } else {
                        console.log(result);
                        sendData.isLogin = "아이디와 비밀번호가 일치하지 않습니다.";
                        res.send(sendData);
                    }
                })
            } else {
                sendData.isLogin("아이디를 찾을 수 없습니다.")
                res.send(sendData);
            }
        });

    } else {
        sendData.isLogin = "아이디와 비밀번호를 입력하세요."
        res.send(sendData);
    }
});


app.post("/join", (req, res) => {
    const userId = req.body.userId;
    const passwd = req.body.userPw;
    const passwdRe = req.body.userPwRe;
    const userNm = req.body.userNm;
    const userTel = req.body.userTel;
    const userEmail = req.body.userEmail;
    const userAddr = req.body.userAddr;

    const sendData = { isSuccess : ""};

    if(userId && passwd && passwdRe) {
        db.query('SELECT * FROM USERINFO WHERE USERID = ?' , [userId], function(error, results, fields) {
            if(error) throw error;
            if(results.length <= 0 && passwd == passwdRe) {
                 const encodedPw = bcrypt.hashSync(passwd, 10);
                db.query('INSERT INTO USERINFO (userId, userpw, userNm, TEL, EMAIL, ADDR) VALUES (?, ?, ?, ?, ?, ?)', [userId, encodedPw, userNm, userTel, userEmail, userAddr], function(error, data) {
                    if(error) throw error;
                    req.session.save(function () {
                        sendData.isSuccess = "True"
                        res.send(sendData);
                    });
                });
            } else if (passwd != passwdRe) {
                sendData.isSuccess = "비밀번호 확인란이 일치하지 않습니다.";
                res.send(sendData);
            } else {
                sendData.isSuccess = "이미 존재하는 아이디입니다.";
                res.send(sendData);
            }
        });
    } else {
        sendData.isSuccess = "아이디와 비밀번호를 입력하세요.";
        res.send(sendData);
    }
});

app.get('/user/list', (req, res) => {
    db.query('SELECT * FROM USERINFO', function(error, results, field) {
        if(error) throw error;
        res.send(results);
    })
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})