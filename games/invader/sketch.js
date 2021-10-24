// 矢印で移動
// zで射撃

let player;
let bullets = [];
let enemies = [];
let shotFrame;
let scoreboard;

function setup() {
    createCanvas(640, 480);
    player = new Player(new Vec2(300, 450), 20, color("#69FC78"));
    scoreboard = new Scoreboard(0, 30, color("66FFFF"), new Vec2(20, 30));
    create_enemies();

    // 銃撃のフレームカウント(Playerクラス参照)
    shotFrame = 0;
}


function create_enemies() {
    // 4行9列の敵を作る
    let row = 4;
    let column = 9;

    for(let y=1; y<=row; y++) {
        for(let x=1; x<=column; x++) {
            let pV = new Vec2(70+50*x, 40+50*y);
            let enemy = new Enemy(pV, new Vec2(0, 0), 15, color("#F04C4C"));
            enemies.push(enemy);
        }
    }
}


class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vec) {
        return new Vec2(this.x+vec.x, this.y+vec.y);
    }

    sub(vec) {
        return new Vec2(this.x-vec.x, this.y-vec.y);
    }

    div(val) {
        return new Vec2(this.x/val, this.y/val);
    }

    // ベクトルの大きさ
    mag() {
        return sqrt(this.x**2 + this.y**2);
    }
}


class Player {
    // プレイヤー
    // 位置ベクトル pV
    // 半径 r
    // 色 c
    constructor(pV, r, c) {
        this.pV = pV;
        this.r = r;
        this.c = c;
    }

    draw() {
        fill(this.c);
        ellipse(this.pV.x, this.pV.y, this.r*2);
        fill(255);
    }

    shot() {
        if(shotFrame > 0) {
            return;
        }

        let vV = new Vec2(0, -200);

        // 自機の半径を考慮し、発射
        let bullet = new Bullet(this.pV.add(new Vec2(0, -this.r)), vV, 10);
        bullets.push(bullet);

        // 10フレームに1回しか撃てない
        shotFrame = 30;
    }
}


class Bullet {
    // 弾
    // 位置ベクトル pV
    // 速度ベクトル(1秒間に進む) vV
    // 半径 r
    constructor(pV, vV, r) {
        this.pV = pV;
        this.vV = vV;
        this.r = r;
    }

    draw() {
        this.pV = this.pV.add(this.vV.div(60));
        ellipse(this.pV.x, this.pV.y, this.r*2);
    }
}


class Enemy {
    // 敵
    // 位置ベクトル pV
    // 速度ベクトル(1秒間に進む) vV
    // 半径 r
    // 色 c
    constructor(pV, vV, r, c) {
        this.pV = pV;
        this.vV = vV;
        this.r = r;
        this.c = c;
    }

    draw() {
        fill(this.c);
        ellipse(this.pV.x, this.pV.y, this.r*2);
        fill(255);
    }

    isOn(obj) {
        // 接触判定
        // thisとobjとの距離distを求める
        let diffVec = this.pV.sub(obj.pV);
        let dist = diffVec.mag();

        return dist < this.r+obj.r;
    }

    move() {
        // cosに適当な引数を与え、横運動させる。
        // 最後のframeCount/500は、前進させるためである。
        this.vV = new Vec2(cos(frameCount/50)*120, frameCount/500);
        this.pV = this.pV.add(this.vV.div(60));
    }
}


class Scoreboard {
    // スコアボード
    // スコア score
    // テキストサイズ fontSize
    // 色 c
    // 位置ベクトル pV
    constructor(score, fontSize, c, pV) {
        this.score = score;
        this.fontSize = fontSize;
        this.c = c;
        this.pV = pV;
    }

    draw() {
        let txt = "Score: " + this.score;
        textSize(this.fontSize);
        fill(this.c);
        text(txt, this.pV.x, this.pV.y);
        fill(255);
    }
}


function draw_bullets() {
    bullets.forEach((bullet) => {
        bullet.draw();
    });
}


function draw_enemies() {
    enemies.forEach((enemy) => {
        enemy.draw();
    });
}


function move_enemies() {
    enemies.forEach((enemy) => {
        enemy.move();
    });
}


function draw() {
    shotFrame--;

    // プレイヤーの動作
    if(keyIsDown(LEFT_ARROW)) {
        if(player.pV.x<player.r) {
            return;
        }

        player.pV.x -= 10;
    }
    if(keyIsDown(RIGHT_ARROW)) {
        if(player.pV.x>640-player.r) {
            return;
        }

        player.pV.x += 10;
    }
    // z key
    if(keyIsDown(90)) {
        player.shot();
    }
    // 敵を動かす
    move_enemies();

    // 敵と弾との接触判定/削除
    for(let i=0; i<enemies.length; i++) {
        for(let j=0; j<bullets.length; j++) {
            let enemy = enemies[i];
            let bullet = bullets[j];

            // 乱射時、enemyにisOnメゾットがないと判断されたため
            if(enemy instanceof Enemy && enemy.isOn(bullet)) {
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                scoreboard.score += 10;
            }
        }
    }


    // 描画
    background(100);
    player.draw();
    scoreboard.draw();
    draw_bullets();
    draw_enemies();
}
