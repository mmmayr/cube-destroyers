# crappy_cube.py
# For implementing behavior tree solving with a flat cube representation.

class cube():
    #Cube initialization
    
    def __init__(self):
        
        """
            Naming conventions:
            First entry:
            b = blue
            y = yellow
            o = orange
            w = white
            g = green
            r = red
            Second entry:
            t = top
            m = middle
            b = bottom
            Third entry:
            l = left
            m = middle
            r = right
            
            Blue is "front" face
            Yellow is "top" face
            Red is "right" face
            Orange is "left" face
            White is "bottom" face
            Green is "back" face
        """
        btl = bml = bbl = btm = bmm = bbm = btr = bmr = bbr = "blue"
        ytl = yml = ybl = ytm = ymm = ybm = ytr = ymr = ybr = "yellow"
        rtl = rml = rbl = rtm = rmm = rbm = rtr = rmr = rbr = "red"
        otl = oml = obl = otm = omm = obm = otr = omr = obr = "orange"
        wtl = wml = wbl = wtm = wmm = wbm = wtr = wmr = wbr = "white"
        gtl = gml = gbl = gtm = gmm = gbm = gtr = gmr = gbr = "green"
    
    def front(self, inverted):
        # front is twisting entire blue face clockwise, inverted is counter clockwise
        if inverted is False:
            # blue changes
            # redundant, but ensures the changes aren't based off
            # recently changed values
            btl0 = self.bbl
            btm0 = self.bml
            btr0 = self.btl
            bmr0 = self.btm
            bbr0 = self.btr
            bbm0 = self.bmr
            bbl0 = self.bbr
            bml0 = self.bbm
            self.btl = btl0
            self.btm = btm0
            self.btr = btr0
            self.bmr = bmr0
            self.bbr = bbr0
            self.bbm = bbm0
            self.bbl = bbl0
            self.bml = bml0
            # all other (except green) changes
            # do the same thing above for these changes and
            # for the inverted version
            self.ybl = self.obr
            self.ybm = self.omr
            self.ybr = self.otr
            self.obr = self.wbl
            self.omr = self.wbm
            self.otr = self.wbr
            self.wbl = self.rbl
            self.wbm = self.rml
            self.wbr = self.rtl
            self.rbl = self.ybr
            self.rml = self.ybm
            self.rtl = self.obr
        else:
            self.btl = self.btr
            self.btm = self.bmr
            self.btr = self.bbr
            self.bmr = self.bbm
            self.bbr = self.bbl
            self.bbm = self.bml
            self.bbl = self.btl
            self.bml = self.btm
            
    def up(self, inverted):
        #up is twisting entire yellow face clockwise, inverted is counter clockwise
        if inverted is False:
            
        else:
            
    
    def right(self, inverted):
        #right is twisting the entire red face clockwise, inverted is counter clockwise
        if inverted is False:
            
        else:
            