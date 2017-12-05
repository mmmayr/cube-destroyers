# crappy_cube.py
# For implementing behavior tree solving with a flat cube representation.

class cube():
    #Cube initialization
    
    def __init__(self):#Starts as the "front" side
        blue_top = ["blue","blue","blue"]
        blue_middle = ["blue","blue","blue"]
        blue_bottom = ["blue","blue","blue"]
        self.blue_face = [blue_top, blue_middle, blue_bottom]
        #Starts as the "top" side
        yellow_top = ["yellow", "yellow", "yellow"]
        yellow_middle = ["yellow", "yellow", "yellow"]
        yellow_bottom = ["yellow", "yellow", "yellow"]
        self.yellow_face = [yellow_top, yellow_middle, yellow_bottom]
        #Starts as the "right" side
        red_top = ["red", "red", "red"]
        red_middle = ["red", "red", "red"]
        red_bottom = ["red", "red", "red"]
        self.red_face = [red_top, red_middle, red_bottom]
        #Starts as the "left" side
        orange_top = ["orange", "orange", "orange"]
        orange_middle = ["orange", "orange", "orange"]
        orange_bottom = ["orange", "orange", "orange"]
        self.orange_face = [orange_top, orange_middle, orange_bottom]
        #Starts as the "bottom" side
        white_top = ["white", "white", "white"]
        white_middle = ["white", "white", "white"]
        white_bottom = ["white", "white", "white"]
        self.white_face = [white_top, white_middle, white_bottom]
        #Starts as the "back" side
        green_top = ["green", "green", "green"]
        green_middle = ["green", "green", "green"]
        green_bottom = ["green", "green", "green"]
        self.green_face = [green_top, green_middle, green_bottom]