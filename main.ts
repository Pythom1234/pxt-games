enum Speed {
    //% block="slow"
    Slow,
    //% block="normal"
    Normal,
    //% block="fast"
    Fast,
    //% block="furious"
    Furious,
}



//% icon="\uf11b" color="#ff5f00"
namespace games {
    let lastScore = 0
    //% block="Flappy Bird (buzzer $buzzer, speed $speed, color $color)"
    //% weight=99
    export function flappyBird(buzzer: boolean, speed: Speed, color: boolean): void {
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
                if (input.buttonIsPressed(Button.A) || input.buttonIsPressed(Button.B)) {
                    air_time = 0
                    add_y = 3
                }
                if (add_y != 0) {
                    y += 0 - add_y
                    add_y += 0 - 1
                }

                if (!(add_y != 0)) {
                    y += air_time
                    air_time += 1
                }

                if (y < 0 || y > 62) {
                    live = false
                    if (buzzer) {
                        pins.analogPitch(512, 100)
                    }
                }

                OLED.clear(color)
                OLED.drawRect(5, y, 7, y + 2, !color, true)
                OLED.text(score.toString(), 0, 0, !color)
                if (speed == Speed.Slow) {
                    OLED.text("slow", 97, 0, !color)
                }
                if (speed == Speed.Normal) {
                    OLED.text("normal", 83, 0, !color)
                }
                if (speed == Speed.Fast) {
                    OLED.text("fast", 99, 0, !color)
                }
                if (speed == Speed.Furious) {
                    OLED.text("furious", 74, 0, !color)
                }
                if (parseInt(walls[walls.length - 1].split(" ")[1]) < 100) {
                    walls.push(randint(20, 44).toString() + " 127")
                }
                for (const i of walls) {
                    if (parseInt(i.split(" ")[1]) <= 0) {
                        walls.removeElement(i)
                        score += 1
                        if (buzzer) {
                            pins.analogPitch(512, 20)
                        }
                        continue
                    }
                    if (2 < parseInt(i.split(" ")[1]) && parseInt(i.split(" ")[1]) < 9) {
                        if (!(parseInt(i.split(" ")[0]) - 10 < y && y < parseInt(i.split(" ")[0]) + 10)) {
                            live = false
                            if (buzzer) {
                                pins.analogPitch(512, 100)
                            }
                        }
                    }
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
                OLED.draw()
            } else {
                OLED.clear(!color)
                OLED.text("you lost", 32, 26, color)
                OLED.text("score: " + score.toString(), 32, 37, color)
                if (exit == 0) {
                    OLED.text("press A or B", 20, 48, color)
                }
                OLED.draw()
                if (exit == 0) {
                    if (input.buttonIsPressed(Button.A) || input.buttonIsPressed(Button.B)) {
                        play = false
                        lastScore = score
                        OLED.clear(false)
                        OLED.draw()
                    }
                } else {
                    exit -= 1
                }
            }
        }
    }
    //% block="get last score"
    //% weight=100
    export function getLastscore(): number {
        return lastScore
    }
}