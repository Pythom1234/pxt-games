enum Speed {
    //% block="slow"
    Slow,
    //% block="normal"
    Normal,
    //% block="fast"
    Fast,
    //% block="furious"
    Furious
}
enum RenderingLevel {
    //% block="nothing"
    Nothing,
    //% block="score"
    Score,
    //% block="score + speed"
    ScoreSpeed
}
enum Control {
    //% block="buttons A/B"
    AB,
    //% block="ADKeyboard (pin 1)"
    ADKeyboard,
    //% block="buttons B/A (reverse)"
    ABReverse,
}



//% icon="\uf11b" color="#ff5f00"
namespace games {
    let lastScore: Array<number> = []
    //% block="catch apples|buzzer $buzzer|color $color|controlling $controlling|lives $nLives"
    //% weight=94
    //% nLives.defl=3
    //% inlineInputMode="external"
    export function catchApples(buzzer: boolean, color: boolean, controlling: Control, nLives: number) {
        pins.setAudioPinEnabled(true)
        let play = true
        let lives = nLives
        let score = 0
        let apples: number[][] = []
        apples.push([randint(10, 117), 0])
        let x = 63
        const playerSpeed = 10
        while (play) {
            if (lives > 0) {
                if (controlling == Control.AB) {
                    if (input.buttonIsPressed(Button.A)) {
                        x -= playerSpeed
                    }
                    if (input.buttonIsPressed(Button.B)) {
                        x += playerSpeed
                    }
                }
                if (controlling == Control.ABReverse) {
                    if (input.buttonIsPressed(Button.A)) {
                        x += playerSpeed
                    }
                    if (input.buttonIsPressed(Button.B)) {
                        x -= playerSpeed
                    }
                }
                if (controlling == Control.ADKeyboard) {
                    if (ADKeyboard.adKeyboardIsPressed(ADKeys.A, AnalogPin.P1)) {
                        x -= playerSpeed
                    }
                    if (ADKeyboard.adKeyboardIsPressed(ADKeys.B, AnalogPin.P1)) {
                        x += playerSpeed
                    }
                }
                x = Math.constrain(x, 5, 122)
                for (let apple of apples) {
                    apples[apples.indexOf(apple)][1] += 3
                }
                for (let apple of apples) {
                    if (apple[1] == 57) {
                        if (apple[0] > x - 5 && apple[0] < x + 5) {
                            score += 1
                            if (buzzer) {
                                pins.analogPitch(512, 20)
                            }
                        } else {
                            lives -= 1
                            if (buzzer) {
                                pins.analogPitch(512, 100)
                            }
                        }
                        apples.push([randint(10, 117), 0])
                    }
                }
                oled.clear(color)
                for (let apple of apples) {
                    oled.drawImage(images.createImage(`
                    . . . # .
                    . . # . .
                    . # # # .
                    # # # # #
                    # # # # #
                    . # # # .
                    `), apple[0] - 2, apple[1], !color, false, false)
                }
                oled.drawImage(images.createImage(`
                # # # # # # # # # #
                # # # # # # # # # #
                # # # # # # # # # #
                `), x - 5, 61, !color, false, false)
                oled.drawText("lives: " + lives.toString(), 0, 0, !color, false)
                oled.drawText("score: " + score.toString(), 0, 11, !color, false)
                oled.draw()
            } else {
                oled.clear(!color)
                oled.drawText("you lost", 25, 10, color, false)
                oled.drawText("score: " + score.toString(), 25, 21, color, false)
                oled.drawText("A: continue", 25, 32, color, false)
                oled.draw()
                if (controlling == Control.AB) {
                    if (input.buttonIsPressed(Button.A)) {
                        play = false
                        lastScore.push(score)
                        oled.clear(false)
                        oled.draw()
                    }
                }
                if (controlling == Control.ABReverse) {
                    if (input.buttonIsPressed(Button.A)) {
                        play = false
                        lastScore.push(score)
                        oled.clear(false)
                        oled.draw()
                    }
                }
                if (controlling == Control.ADKeyboard) {
                    if (ADKeyboard.adKeyboardIsPressed(ADKeys.A, AnalogPin.P1)) {
                        play = false
                        lastScore.push(score)
                        oled.clear(false)
                        oled.draw()
                    }
                }
            }
        }
    }
    //% block="Snake|buzzer $buzzer|color $color|controlling $controlling|apples $nApples"
    //% weight=95
    //% inlineInputMode="external"
    export function snake(buzzer: boolean, color: boolean, controlling: Control, nApples: number): void {
        pins.setAudioPinEnabled(true)
        let play = true
        let score = 0
        let live = true
        let positions: Array<Array<number>> = [[32, 20], [32, 19], [32, 18]]
        let direction = 0
        let directions: Array<Array<number>> = [[0, -1], [-1, 0], [0, 1], [1, 0]]
        let apples: Array<Array<number>> = []
        for (let i = 0; i < nApples; i++) {
            apples.push([randint(5, 58), randint(5, 26)])
        }
        oled.init()
        let keyPressed = [false, false]
        while (play) {
            if (live) {
                const time1 = control.millis()
                if (controlling == Control.AB) {
                    if (input.buttonIsPressed(Button.A)) {
                        if (!keyPressed[0]) {
                            direction += 1
                        }
                        keyPressed[0] = true
                    } else {
                        keyPressed[0] = false
                    }
                    if (input.buttonIsPressed(Button.B)) {
                        if (!keyPressed[1]) {
                            direction -= 1
                        }
                        keyPressed[1] = true
                    } else {
                        keyPressed[1] = false
                    }
                }
                if (controlling == Control.ABReverse) {
                    if (input.buttonIsPressed(Button.A)) {
                        if (!keyPressed[0]) {
                            direction -= 1
                        }
                        keyPressed[0] = true
                    } else {
                        keyPressed[0] = false
                    }
                    if (input.buttonIsPressed(Button.B)) {
                        if (!keyPressed[1]) {
                            direction += 1
                        }
                        keyPressed[1] = true
                    } else {
                        keyPressed[1] = false
                    }
                }
                if (controlling == Control.ADKeyboard) {
                    if (ADKeyboard.adKeyboardIsPressed(ADKeys.A, AnalogPin.P1)) {
                        if (!keyPressed[0]) {
                            direction += 1
                        }
                        keyPressed[0] = true
                    } else {
                        keyPressed[0] = false
                    }
                    if (ADKeyboard.adKeyboardIsPressed(ADKeys.B, AnalogPin.P1)) {
                        if (!keyPressed[1]) {
                            direction -= 1
                        }
                        keyPressed[1] = true
                    } else {
                        keyPressed[1] = false
                    }
                }
                if (direction == -1) {
                    direction = 3
                }
                if (direction == 4) {
                    direction = 0
                }
                const forward = [
                    positions[positions.length - 1][0] + directions[direction][0],
                    positions[positions.length - 1][1] + directions[direction][1]
                ]
                let snakeForward = false
                for (let pos of positions) {
                    if (pos[0] == forward[0] && pos[1] == forward[1]) {
                        snakeForward = true
                        break
                    }
                }
                if (forward[0] == 0 || forward[1] == 0 || forward[0] == 63 || forward[1] == 31 || snakeForward) {
                    live = false
                    if (buzzer) {
                        pins.analogPitch(512, 100)
                    }
                }
                let appleForward = false
                let _apple
                for (let apple of apples) {
                    if (apple[0] == forward[0] && apple[1] == forward[1]) {
                        appleForward = true
                        _apple = apple
                        break
                    }
                }
                if (appleForward) {
                    if (buzzer) {
                        pins.analogPitch(512, 20)
                    }
                    score += 1
                    apples.removeAt(apples.indexOf(_apple))
                    apples.push([randint(5, 58), randint(5, 26)])
                } else {
                    positions.removeAt(0)
                }
                positions.push(forward)
                oled.clear(color)
                oled.drawRect(0, 0, 127, 63, true, false, false)
                oled.drawRect(1, 1, 126, 62, !color, false, false)
                for (let pos of positions) {
                    oled.setPx(pos[0] * 2, pos[1] * 2, !color)
                    oled.setPx(pos[0] * 2 + 1, pos[1] * 2, !color)
                    oled.setPx(pos[0] * 2, pos[1] * 2 + 1, !color)
                    oled.setPx(pos[0] * 2 + 1, pos[1] * 2 + 1, !color)
                }
                for (let apple of apples) {
                    //oled.setPx(apple[0] * 2, apple[1] * 2, !color)
                    oled.setPx(apple[0] * 2 + 1, apple[1] * 2, !color)
                    oled.setPx(apple[0] * 2, apple[1] * 2 + 1, !color)
                    oled.setPx(apple[0] * 2 + 1, apple[1] * 2 + 1, !color)
                }
                oled.draw()
                const time2 = control.millis()
                const time = time2 - time1
                basic.pause(100 - time)
            } else {
                oled.clear(!color)
                oled.drawText("you lost", 25, 10, color, false)
                oled.drawText("score: " + score.toString(), 25, 21, color, false)
                oled.drawText("A: continue", 25, 32, color, false)
                oled.draw()
                if (controlling == Control.AB) {
                    if (input.buttonIsPressed(Button.A)) {
                        play = false
                        lastScore.push(score)
                        oled.clear(false)
                        oled.draw()
                    }
                }
                if (controlling == Control.ABReverse) {
                    if (input.buttonIsPressed(Button.A)) {
                        play = false
                        lastScore.push(score)
                        oled.clear(false)
                        oled.draw()
                    }
                }
                if (controlling == Control.ADKeyboard) {
                    if (ADKeyboard.adKeyboardIsPressed(ADKeys.A, AnalogPin.P1)) {
                        play = false
                        lastScore.push(score)
                        oled.clear(false)
                        oled.draw()
                    }
                }
            }
        }
    }
    //% block="Flappy Bird|buzzer $buzzer|speed $speed|color $color|rendering level $rendernigLevel|can restart $restart|controlling $controlling"
    //% rendernigLevel.defl=RenderingLevel.Score
    //% weight=96
    //% inlineInputMode="external"
    export function flappyBird(buzzer: boolean, speed: Speed, color: boolean, rendernigLevel: RenderingLevel, restart: number, controlling: Control): void {
        pins.setAudioPinEnabled(true)
        let play = true
        let exit = 3
        let add_y = 0
        let air_time = 5
        oled.init()
        let y = 32
        let live = true
        let walls = ["32 64"]
        let score = 0
        while (play) {
            if (live) {
                if (controlling == Control.AB || controlling == Control.ABReverse) {
                    if (input.buttonIsPressed(Button.A) || input.buttonIsPressed(Button.B)) {
                        air_time = 0
                        add_y = 3
                    }
                }
                if (controlling == Control.ADKeyboard) {
                    if (ADKeyboard.adKeyboardGetPressed(AnalogPin.P1) != "") {
                        air_time = 0
                        add_y = 3
                    }
                }
                if (add_y != 0) {
                    y += 0 - add_y
                    add_y += 0 - 1
                }

                if (!(add_y != 0)) {
                    y += air_time
                    air_time += 1
                }

                if (y < 0 || y > 63) {
                    live = false
                    if (buzzer) {
                        pins.analogPitch(512, 100)
                    }
                }

                oled.clear(color)
                oled.drawRect(5, y, 7, y + 2, !color, true, false)
                if (parseInt(walls[walls.length - 1].split(" ")[1]) < 100) {
                    walls.push(randint(20, 46).toString() + " 127")
                }
                for (const i of walls) {
                    if (parseInt(i.split(" ")[1]) <= 0) {
                        walls.removeElement(i)
                        score += 1
                        if (buzzer) {
                            pins.analogPitch(512, 20)
                        }
                    }
                    if (2 < parseInt(i.split(" ")[1]) && parseInt(i.split(" ")[1]) < 7) {
                        if (!(parseInt(i.split(" ")[0]) - 10 < y && y < parseInt(i.split(" ")[0]) + 10)) {
                            live = false
                            if (buzzer) {
                                pins.analogPitch(512, 100)
                            }
                        }
                    }
                    if (live) {
                        if (speed == Speed.Slow) {
                            walls[walls.indexOf(i)] = i.split(" ")[0] + " " + (parseInt(i.split(" ")[1]) - 1).toString()
                        }
                        if (speed == Speed.Normal) {
                            walls[walls.indexOf(i)] = i.split(" ")[0] + " " + (parseInt(i.split(" ")[1]) - 2).toString()
                        }
                        if (speed == Speed.Fast) {
                            walls[walls.indexOf(i)] = i.split(" ")[0] + " " + (parseInt(i.split(" ")[1]) - 3).toString()
                        }
                        if (speed == Speed.Furious) {
                            walls[walls.indexOf(i)] = i.split(" ")[0] + " " + (parseInt(i.split(" ")[1]) - 4).toString()
                        }
                        oled.drawLine(parseInt(i.split(" ")[1]), 0, parseInt(i.split(" ")[1]), parseInt(i.split(" ")[0]) - 10, !color, false)
                        oled.drawLine(parseInt(i.split(" ")[1]), parseInt(i.split(" ")[0]) + 10, parseInt(i.split(" ")[1]), 63, !color, false)
                    }
                }
                if (live) {
                    if (rendernigLevel == RenderingLevel.Score) {
                        oled.drawText(score.toString(), 1, 1, !color, false)
                    }
                    if (rendernigLevel == RenderingLevel.ScoreSpeed) {
                        oled.drawText(score.toString(), 1, 1, !color, false)
                        if (speed == Speed.Slow) {
                            oled.drawText("slow", 96, 1, !color, false)
                        }
                        if (speed == Speed.Normal) {
                            oled.drawText("normal", 82, 1, !color, false)
                        }
                        if (speed == Speed.Fast) {
                            oled.drawText("fast", 98, 1, !color, false)
                        }
                        if (speed == Speed.Furious) {
                            oled.drawText("furious", 73, 1, !color, false)
                        }
                    }
                    oled.draw()
                }
            } else {
                if (exit != -1) {
                    oled.clear(!color)
                    oled.drawText("you lost", 25, 10, color, false)
                    oled.drawText("score: " + score.toString(), 25, 21, color, false)
                    if (exit == 0) {
                        oled.drawText("A: continue", 25, 32, color, false)
                        if (restart != 0) {
                            oled.drawText("B: restart", 25, 43, color, false)
                        }
                        exit -= 1
                    }
                    oled.draw()
                }
                if (exit == -1) {
                    if (controlling == Control.AB) {
                        if (input.buttonIsPressed(Button.A)) {
                            play = false
                            lastScore.push(score)
                            oled.clear(false)
                            oled.draw()
                        }
                        if (input.buttonIsPressed(Button.B) && restart != 0) {
                            lastScore.push(score)
                            flappyBird(buzzer, speed, color, rendernigLevel, restart - 1, controlling)
                            play = false
                        }
                    }
                    if (controlling == Control.ABReverse) {
                        if (input.buttonIsPressed(Button.A)) {
                            play = false
                            lastScore.push(score)
                            oled.clear(false)
                            oled.draw()
                        }
                        if (input.buttonIsPressed(Button.B) && restart != 0) {
                            lastScore.push(score)
                            flappyBird(buzzer, speed, color, rendernigLevel, restart - 1, controlling)
                            play = false
                        }
                    }
                    if (controlling == Control.ADKeyboard) {
                        if (ADKeyboard.adKeyboardIsPressed(ADKeys.A, AnalogPin.P1)) {
                            play = false
                            lastScore.push(score)
                            oled.clear(false)
                            oled.draw()
                        }
                        if (ADKeyboard.adKeyboardIsPressed(ADKeys.B, AnalogPin.P1) && restart != 0) {
                            lastScore.push(score)
                            flappyBird(buzzer, speed, color, rendernigLevel, restart - 1, controlling)
                            play = false
                        }
                    }
                }
                if (exit > 0) {
                    exit -= 1
                }
            }
        }
    }
    //% block="get last score"
    //% weight=100
    export function getLastScore(): number {
        return lastScore[lastScore.length - 1]
    }
    //% block="get all scores"
    //% weight=99
    export function getScores(): Array<number> {
        return lastScore
    }
    //% block="delete score list"
    //% weight=98
    export function delScores(): void {
        lastScore = []
    }
    //% block="game select|controlling $controlling"
    //% inlineInputMode="external"
    //% weight=97
    export function gameSelect(controlling: Control): void {
        let select = 0
        const games = ["Flappy Bird", "Snake", "catch the apples"]
        let keyPressed = [false, false]
        let selected = false
        oled.init()
        while (true) {
            if (controlling == Control.AB) {
                if (input.buttonIsPressed(Button.A)) {
                    if (!keyPressed[0]) {
                        select += 1
                    }
                    keyPressed[0] = true
                } else {
                    keyPressed[0] = false
                }
                if (input.buttonIsPressed(Button.B)) {
                    if (!keyPressed[1]) {
                        select -= 1
                    }
                    keyPressed[1] = true
                } else {
                    keyPressed[1] = false
                }
                if (input.buttonIsPressed(Button.A) && input.buttonIsPressed(Button.B)) {
                    selected = true
                }
            }
            if (controlling == Control.ABReverse) {
                if (input.buttonIsPressed(Button.A)) {
                    if (!keyPressed[0]) {
                        select -= 1
                    }
                    keyPressed[0] = true
                } else {
                    keyPressed[0] = false
                }
                if (input.buttonIsPressed(Button.B)) {
                    if (!keyPressed[1]) {
                        select += 1
                    }
                    keyPressed[1] = true
                } else {
                    keyPressed[1] = false
                }
                if (input.buttonIsPressed(Button.A) && input.buttonIsPressed(Button.B)) {
                    selected = true
                }
            }
            if (controlling == Control.ADKeyboard) {
                if (ADKeyboard.adKeyboardIsPressed(ADKeys.C, AnalogPin.P1)) {
                    if (!keyPressed[0]) {
                        select += 1
                    }
                    keyPressed[0] = true
                } else {
                    keyPressed[0] = false
                }
                if (ADKeyboard.adKeyboardIsPressed(ADKeys.E, AnalogPin.P1)) {
                    if (!keyPressed[1]) {
                        select -= 1
                    }
                    keyPressed[1] = true
                } else {
                    keyPressed[1] = false
                }
                if (ADKeyboard.adKeyboardIsPressed(ADKeys.D, AnalogPin.P1)) {
                    selected = true
                }
            }
            if (selected) {
                const game = games[select]
                if (game == "Snake") {
                    snake(false, false, controlling, 5)
                }
                if (game == "Flappy Bird") {
                    flappyBird(false, Speed.Furious, false, RenderingLevel.Score, 100, controlling)
                }
                if (game == "catch the apples") {
                    catchApples(false,false,controlling,3)
                }
                selected = false
            }
            if (select > games.length - 1) {
                select = 0
            }
            if (select < 0) {
                select = games.length - 1
            }
            oled.clear(false)
            oled.drawText(games[select], 0, 0, true, false)
            oled.draw()
        }
    }
}