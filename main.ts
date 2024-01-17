let score = 0;
let dead = false;
let retry = false;

function create_apple() {
    return create_vec2(randint(0, 4), randint(0, 4))
}
function create_vec2(x: number, y: number) {
    return {
        x: x,
        y: y
    }
}
function death() {
    basic.showLeds(`
        # . . . #
        . # . # .
        . . # . .
        . # . # .
        # . . . #
        `)
    pause(2000);
    basic.clearScreen();
    basic.showString("Score: " + score.toString());
    retry = true;
}
input.onButtonPressed(Button.A, function () {
    direction += 0 - 1
    if (direction < 0) {
        direction = 3
    }
})
input.onButtonPressed(Button.AB, function () {
    to_draw = [];
    head.x = 2;
    head.y = 4;
    dead = false;
    score = 0;
    if (!retry)
        basic.forever(function () {
            if (!dead) {
                eaten_apple = false;
                serial.writeNumber(frames_since_eaten);


                basic.clearScreen()
                if (direction == Dir.North) {
                    head.y -= 1;
                } else if (direction == Dir.East) {
                    head.x += 1;
                } else if (direction == Dir.South) {
                    head.y += 1;
                } else if (direction == Dir.West) {
                    head.x -= 1;
                }
                for (let block of to_draw) {
                    if (serialize_vec(block) == serialize_vec(apple_pos)) {
                        eaten_apple = true;
                        apple_pos = create_apple();
                        score += 1;
                    }
                }
                if (!eaten_apple) {
                    to_draw = to_draw.slice(1, to_draw.length)

                } else {
                    // serial.writeLine("eaten apple");
                }

                to_draw.push(create_vec2(head.x, head.y));
                serial.writeLine("----------");
                // serial.writeNumber(to_draw.length);
                for (let block2 of to_draw) {
                    serial.writeLine(serialize_vec(block2));
                    led.plot(block2.x, block2.y)
                }
                led.plot(apple_pos.x, apple_pos.y)
                pause(1000);
                if (out_of_bounds(head)) {
                    dead = true;
                    death();
                }
                for (let i = 0; i < to_draw.length - 1; i++) {
                    if (serialize_vec(to_draw[i]) == serialize_vec(head)) {
                        dead = true;
                        death();
                    }
                }


            }
        })

})
input.onButtonPressed(Button.B, function () {
    direction += 1
    if (direction > 3) {
        direction = 0
    }
})
let eaten_apple = false
let to_draw: Vector2[] = []
interface Vector2 {
    x: number,
    y: number
}
enum Dir {
    North = 0,
    East,
    South,
    West
}
function out_of_bounds(pos: Vector2): boolean {
    if (pos.x < 0 || pos.x > 4) {
        return true;
    }
    if (pos.y < 0 || pos.y > 4) {
        return true;
    }
    return false;
}
function serialize_vec(vec: Vector2) {
    return vec.x.toString() + "," + vec.y.toString();
}
let head = { x: 2, y: 4 };
let apple_pos = create_apple()
let direction: Dir = Dir.North;
let frames_since_eaten = 1
