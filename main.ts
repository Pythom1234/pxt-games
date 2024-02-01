enum Controlling {
    //% block="buttons"
    Buttons,
    //% block="gyroscope"
    Gyro
}



//% icon="\uf11b" color="#ff5f00"
namespace games {
    //% block="Flappy Bird (buzzer $buzzer, controlling $control)"
    export function flappyBird(buzzer: boolean, control: Controlling): void {
        pins.setAudioPinEnabled(true)
        let add_y = 0
        let air_time = 5
        OLED.init()
        let y = 32
        let live = true
        let walls = ["32 64"]
        let score = 0
        basic.forever(function on_forever() {
            if (live) {
                if (control == Controlling.Buttons) {
                    if (input.buttonIsPressed(Button.A) || input.buttonIsPressed(Button.B)) {
                        air_time = 0
                        add_y = 3
                    }
                }
                if (control == Controlling.Gyro) {
                    if (input.acceleration(Dimension.Y) < -20) {
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

                if (y < 0 || y > 62) {
                    live = false
                }

                OLED.clear(false)
                OLED.drawRect(5, y, 7, y + 2, true, true)
                OLED.text(score.toString(), 0, 0, true)
                if (parseInt(walls[walls.length - 1].split(" ")[1]) < 100) {
                    walls.push(randint(20, 44).toString() + " 127")
                }
                for (const i of walls) {
                    if (i.split(" ")[1] == "0") {
                        walls.removeElement(i)
                        score += 1
                        if (buzzer) {
                            pins.analogPitch(512, 5)
                        }
                        continue
                    }
                    if (2 < parseInt(i.split(" ")[1]) && parseInt(i.split(" ")[1]) < 9) {
                        if (!(parseInt(i.split(" ")[0]) - 10 < y && y < parseInt(i.split(" ")[0]) + 10)) {
                            live = false
                        }
                    }
                    walls[walls.indexOf(i)] = i.split(" ")[0] + " " + (parseInt(i.split(" ")[1]) - 1).toString()
                    OLED.drawLine(parseInt(i.split(" ")[1]), 0, parseInt(i.split(" ")[1]), parseInt(i.split(" ")[0]) - 10, true)
                    OLED.drawLine(parseInt(i.split(" ")[1]), parseInt(i.split(" ")[0]) + 10, parseInt(i.split(" ")[1]), 63, true)
                }
                OLED.draw()
            } else {
                if (buzzer) {
                    pins.analogPitch(512, 10)
                }
                OLED.clear(true)
                OLED.text("you lost", 32, 26, false)
                OLED.text("score: " + score.toString(), 32, 37, false)
                OLED.draw()
            }

        })
    }
}