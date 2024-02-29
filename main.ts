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
    //% block="Snake|buzzer $buzzer|color $color|controlling $controlling|apples $nApples"
    //% weight=96
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
        OLED.init()
        while (play) {
            if (live) {
                const time1 = control.millis()
                if (controlling == Control.AB) {
                    if (input.buttonIsPressed(Button.A)) {
                        direction += 1
                    }
                    if (input.buttonIsPressed(Button.B)) {
                        direction -= 1
                    }
                }
                if (controlling == Control.ABReverse) {
                    if (input.buttonIsPressed(Button.A)) {
                        direction -= 1
                    }
                    if (input.buttonIsPressed(Button.B)) {
                        direction += 1
                    }
                }
                if (controlling == Control.ADKeyboard) {
                    if (ADKeyboard.adKeyboardIsPressed(ADKeys.A, AnalogPin.P1)) {
                        direction += 1
                    }
                    if (ADKeyboard.adKeyboardIsPressed(ADKeys.B, AnalogPin.P1)) {
                        direction -= 1
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
                if (forward[0] == 0 || forward[1] == 0 || forward[0] == 64 || forward[1] == 32 || snakeForward) {
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
                OLED.clear(color)
                for (let pos of positions) {
                    OLED.setPx(pos[0] * 2, pos[1] * 2, !color)
                    OLED.setPx(pos[0] * 2 + 1, pos[1] * 2, !color)
                    OLED.setPx(pos[0] * 2, pos[1] * 2 + 1, !color)
                    OLED.setPx(pos[0] * 2 + 1, pos[1] * 2 + 1, !color)
                }
                for (let apple of apples) {
                    //OLED.setPx(apple[0] * 2, apple[1] * 2, !color)
                    OLED.setPx(apple[0] * 2 + 1, apple[1] * 2, !color)
                    OLED.setPx(apple[0] * 2, apple[1] * 2 + 1, !color)
                    OLED.setPx(apple[0] * 2 + 1, apple[1] * 2 + 1, !color)
                }
                OLED.draw()
                const time2 = control.millis()
                const time = time2 - time1
                basic.pause(200 - time)
            } else {
                OLED.clear(!color)
                OLED.text("you lost", 25, 10, color)
                OLED.text("score: " + score.toString(), 25, 21, color)
                OLED.text("A: continue", 25, 32, color)
                OLED.draw()
                if (controlling == Control.AB) {
                    if (input.buttonIsPressed(Button.A)) {
                        play = false
                        lastScore.push(score)
                        OLED.clear(false)
                        OLED.draw()
                    }
                }
                if (controlling == Control.ABReverse) {
                    if (input.buttonIsPressed(Button.A)) {
                        play = false
                        lastScore.push(score)
                        OLED.clear(false)
                        OLED.draw()
                    }
                }
                if (controlling == Control.ADKeyboard) {
                    if (ADKeyboard.adKeyboardIsPressed(ADKeys.A, AnalogPin.P1)) {
                        play = false
                        lastScore.push(score)
                        OLED.clear(false)
                        OLED.draw()
                    }
                }
            }
        }
    }
    //% block="Flappy Bird|buzzer $buzzer|speed $speed|color $color|rendering level $rendernigLevel|can restart $restart|controlling $controlling"
    //% rendernigLevel.defl=RenderingLevel.Score
    //% weight=97
    //% inlineInputMode="external"
    export function flappyBird(buzzer: boolean, speed: Speed, color: boolean, rendernigLevel: RenderingLevel, restart: number, controlling: Control): void {
        pins.setAudioPinEnabled(true)
        let play = true
        let exit = 3
        let add_y = 0
        let air_time = 5
        OLED.init()
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

                OLED.clear(color)
                OLED.drawRect(5, y, 7, y + 2, !color, true)
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
                        OLED.drawLine(parseInt(i.split(" ")[1]), 0, parseInt(i.split(" ")[1]), parseInt(i.split(" ")[0]) - 10, !color)
                        OLED.drawLine(parseInt(i.split(" ")[1]), parseInt(i.split(" ")[0]) + 10, parseInt(i.split(" ")[1]), 63, !color)
                    }
                }
                if (live) {
                    if (rendernigLevel == RenderingLevel.Score) {
                        OLED.text(score.toString(), 1, 1, !color)
                    }
                    if (rendernigLevel == RenderingLevel.ScoreSpeed) {
                        OLED.text(score.toString(), 1, 1, !color)
                        if (speed == Speed.Slow) {
                            OLED.text("slow", 96, 1, !color)
                        }
                        if (speed == Speed.Normal) {
                            OLED.text("normal", 82, 1, !color)
                        }
                        if (speed == Speed.Fast) {
                            OLED.text("fast", 98, 1, !color)
                        }
                        if (speed == Speed.Furious) {
                            OLED.text("furious", 73, 1, !color)
                        }
                    }
                    OLED.draw()
                }
            } else {
                if (exit != -1) {
                    OLED.clear(!color)
                    OLED.text("you lost", 25, 10, color)
                    OLED.text("score: " + score.toString(), 25, 21, color)
                    if (exit == 0) {
                        OLED.text("A: continue", 25, 32, color)
                        if (restart != 0) {
                            OLED.text("B: restart", 25, 43, color)
                        }
                        exit -= 1
                    }
                    OLED.draw()
                }
                if (exit == -1) {
                    if (controlling == Control.AB) {
                        if (input.buttonIsPressed(Button.A)) {
                            play = false
                            lastScore.push(score)
                            OLED.clear(false)
                            OLED.draw()
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
                            OLED.clear(false)
                            OLED.draw()
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
                            OLED.clear(false)
                            OLED.draw()
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
}