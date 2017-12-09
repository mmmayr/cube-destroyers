/*
*
* HTML5: CSS3 & JavaScript Rubik's cube
* Rubik's Cube ® used by permission of Seven Towns Limited.
* http://www.rubiks.com
*
*/
var myText = 0;
var scrambleBool=false;
var counter=0;
var counterformovement = 0;

// testing behaviortree print
function setdisplaystobeblank(){
  var x = document.getElementById("myDIV");
  x.style.display = "none";

  var a = document.getElementById("myDIV1");
  a.style.display = "none";

  var b = document.getElementById("myDIV2");
  b.style.display = "none";

  var c = document.getElementById("myDIV3");
  c.style.display = "none";
}

function setfourtobetrue(){
  var x = document.getElementById("myDIV");
  x.style.display =  "block";

}

function setdivonetobetrue(){
  var x = document.getElementById("myDIV1");
  x.style.display =  "block";

}
function setdivtwotobetrue(){
  var x = document.getElementById("myDIV2");
  x.style.display =  "block";

}
function setdivthreetobetrue(){
  var x = document.getElementById("myDIV3");
  x.style.display =  "block";

}

 // testing behaviortree print
function myFunction() {
    document.getElementById("myText").innerHTML = counterformovement;
}

YUI.add('rubik-queue', function (Y) {

    Queue = function (config) {
        config = config || {};
        this.size = 0;
        this.current = -1;
    //    this.movementcount = 0;
        this._queue = [];

    };

    Queue.prototype = {
        // ex of m : {face: "R", slice: "M", rotate: "left"}
        add: function (m) {
            if(++this.current == this.size){
                this._queue.push(m);
                this.size++;
            }else{
                this._queue = this._queue.slice(0,this.current);
                this.size = this.current + 1;
                this._queue.push(m);
            }
        },
        undo: function () {
          // basically has a counter that starts at the end of the queue and just undo-s from there
          // and if you click the solve button, it just solves in reverse order i clicked
            var m;
            if(this.current >= 0){
                m = this._queue[this.current];
                m.rotate = m.rotate === 'left'? 'right' : 'left';
                this.current--;
                return m;
            }
        },
        redo: function () {
            if (this.current + 1 < this.size){
                var m = this._queue[++this.current];
                m.rotate = m.rotate === 'left'? 'right' : 'left';
                return m;
            }
        }

    };
    Y.Queue = Queue;
});


YUI.add('rubik', function (Y) {
    /*
    * This is a map for the cubies movements.
    * When the cube rotates in a certain way we have move his position on the cube.
    * Every cubie represent a css class which contains his transformation in 3D
    * Example:
    * When we rotate the left side of the cube clockwise,
    * which is the movement "M" in the left part => LM-left).
    * The cubie which is on the upper side, on the top left corner ("utl"), after the Left side movement
    * goes to the bottom side in the same position ("btl").
    * So on LM-left, "utl" => "btl"
    * Where "utl" class is .utl {-webkit-transform:rotateX(90deg)   translate3d(50px,-100px,0)}
    * and "btl" class is:  .btl {-webkit-transform:rotateX(-180deg) translate3d(50px,-250px,150px)}
    *
    */
    var CUBIE_MOVEMENTS = {
        'LM-left':{
            "utl":"btl","ucl":"bcl","ubl":"bbl","ftl":"utl","fcl":"ucl","fbl":"ubl","dtl":"ftl",
            "dcl":"fcl","dbl":"fbl","btl":"dtl","bcl":"dcl","bbl":"dbl","ltl":"lbl","lcl":"lbc",
            "lbl":"lbr","ltc":"lcl","lbc":"lcr","ltr":"ltl","lcr":"ltc","lbr":"ltr","lcc":"lcc"
        },
        "LM-right":{
            "utl":"ftl","ucl":"fcl","ubl":"fbl","ftl":"dtl","fcl":"dcl","fbl":"dbl","dtl":"btl",
            "dcl":"bcl","dbl":"bbl","btl":"utl","bcl":"ucl","bbl":"ubl","ltl":"ltr","lcl":"ltc",
            "lbl":"ltl","ltc":"lcr","lbc":"lcl","ltr":"lbr","lcr":"lbc","lbr":"lbl","lcc":"lcc"
        },
        'RM-right':{
            "utr":"ftr","ucr":"fcr","ubr":"fbr","ftr":"dtr","fcr":"dcr","fbr":"dbr","dtr":"btr",
            "dcr":"bcr","dbr":"bbr","btr":"utr","bcr":"ucr","bbr":"ubr","rtl":"rbl","rcl":"rbc",
            "rbl":"rbr","rtc":"rcl","rcc":"rcc","rbc":"rcr","rtr":"rtl","rcr":"rtc","rbr":"rtr"
        },
        'RM-left':{
            "utr":"btr","ucr":"bcr","ubr":"bbr","ftr":"utr","fcr":"ucr","fbr":"ubr","dtr":"ftr",
            "dcr":"fcr","dbr":"fbr","btr":"dtr","bcr":"dcr","bbr":"dbr","rtl":"rtr","rcl":"rtc",
            "rbl":"rtl","rtc":"rcr","rbc":"rcl","rtr":"rbr","rcr":"rbc","rbr":"rbl","rcc":"rcc"
        },
        'CM-right':{
            "utc":"ftc","ucc":"fcc","ubc":"fbc","ftc":"dtc",
            "fcc":"dcc","fbc":"dbc","dtc":"btc","dcc":"bcc",
            "dbc":"bbc","btc":"utc","bcc":"ucc","bbc":"ubc"
        },
        'CM-left':{
            "utc":"btc","ucc":"bcc","ubc":"bbc","ftc":"utc",
            "fcc":"ucc","fbc":"ubc","dtc":"ftc","dcc":"fcc",
            "dbc":"fbc","btc":"dtc","bcc":"dcc","bbc":"dbc"
        },
        'UE-left':{
            "rtl":"ftl","rtc":"ftc","rtr":"ftr","ftl":"ltl","ftc":"ltc","ftr":"ltr","ltl":"bbr",
            "ltc":"bbc","ltr":"bbl","bbr":"rtl","bbc":"rtc","bbl":"rtr","utl":"utr","ucl":"utc",
            "ubl":"utl","utc":"ucr","ubc":"ucl","utr":"ubr","ucr":"ubc","ubr":"ubl","ucc":"ucc"
        },
        'UE-right':{
            "ltl":"ftl","ltc":"ftc","ltr":"ftr","ftl":"rtl","ftc":"rtc","ftr":"rtr","rtl":"bbr",
            "rtc":"bbc","rtr":"bbl","bbr":"ltl","bbc":"ltc","bbl":"ltr","utl":"ubl","ucl":"ubc",
            "ubl":"ubr","utc":"ucl","ucc":"ucc","ubc":"ucr","utr":"utl","ucr":"utc","ubr":"utr"
        },
        'CE-right':{
            "fcl":"rcl","fcc":"rcc","fcr":"rcr","lcl":"fcl",
            "lcc":"fcc","lcr":"fcr","bcl":"lcr","bcc":"lcc",
            "bcr":"lcl","rcl":"bcr","rcc":"bcc","rcr":"bcl"
        },
        'CE-left':{
            "fcl":"lcl","fcc":"lcc","fcr":"lcr","rcl":"fcl",
            "rcc":"fcc","rcr":"fcr","bcl":"rcr","bcc":"rcc",
            "bcr":"rcl","lcl":"bcr","lcc":"bcc","lcr":"bcl"
        },
        'DE-left':{
            "fbl":"lbl","fbc":"lbc","fbr":"lbr","lbl":"btr","lbc":"btc","lbr":"btl","btr":"rbl",
            "btc":"rbc","btl":"rbr","rbl":"fbl","rbc":"fbc","rbr":"fbr","dtl":"dbl","dcl":"dbc",
            "dbl":"dbr","dtc":"dcl","dcc":"dcc","dbc":"dcr","dtr":"dtl","dcr":"dtc","dbr":"dtr"
        },
        'DE-right':{
            "fbl":"rbl","fbc":"rbc","fbr":"rbr","rbl":"btr","rbc":"btc","rbr":"btl","btr":"lbl",
            "btc":"lbc","btl":"lbr","lbl":"fbl","lbc":"fbc","lbr":"fbr","dtl":"dtr","dcl":"dtc",
            "dbl":"dtl","dtc":"dcr","dbc":"dcl","dtr":"dbr","dcr":"dbc","dbr":"dbl","dcc":"dcc"
        },
        'FS-left':{
            "ubl":"lbr","ubc":"lcr","ubr":"ltr","lbr":"dtr","lcr":"dtc","ltr":"dtl","dtl":"rbl",
            "dtc":"rcl","dtr":"rtl","rbl":"ubr","rcl":"ubc","rtl":"ubl","ftl":"fbl","fcl":"fbc",
            "fbl":"fbr","ftc":"fcl","fcc":"fcc","fbc":"fcr","ftr":"ftl","fcr":"ftc","fbr":"ftr"
        },
        'FS-right':{
            "ubl":"rtl","ubc":"rcl","ubr":"rbl","lbr":"ubl","lcr":"ubc","ltr":"ubr","dtl":"ltr",
            "dtc":"lcr","dtr":"lbr","rbl":"dtl","rcl":"dtc","rtl":"dtr","ftl":"ftr","fcl":"ftc",
            "fbl":"ftl","ftc":"fcr","fbc":"fcl","ftr":"fbr","fcr":"fbc","fbr":"fbl","fcc":"fcc"

        },
        'CS-left':{
            "ucl":"lbc","ucc":"lcc","ucr":"ltc","ltc":"dcl",
            "lcc":"dcc","lbc":"dcr","dcl":"rbc","dcc":"rcc",
            "dcr":"rtc","rbc":"ucr","rcc":"ucc","rtc":"ucl"

        },
        'CS-right':{
            "lbc":"ucl","lcc":"ucc","ltc":"ucr","dcl":"ltc",
            "dcc":"lcc","dcr":"lbc","rbc":"dcl","rcc":"dcc",
            "rtc":"dcr","ucr":"rbc","ucc":"rcc","ucl":"rtc"
        },
        'BS-right':{
            "utl":"rtr","utc":"rcr","utr":"rbr","rtr":"dbr","rcr":"dbc","rbr":"dbl","dbr":"lbl",
            "dbc":"lcl","dbl":"ltl","lbl":"utl","lcl":"utc","ltl":"utr","btl":"bbl","bcl":"bbc",
            "bbl":"bbr","btc":"bcl","bcc":"bcc","bbc":"bcr","btr":"btl","bcr":"btc","bbr":"btr"
        },
        'BS-left':{
            "rtr":"utl","rcr":"utc","rbr":"utr","dbr":"rtr","dbc":"rcr","dbl":"rbr","lbl":"dbr",
            "lcl":"dbc","ltl":"dbl","utl":"lbl","utc":"lcl","utr":"ltl","btl":"btr","bcl":"btc",
            "bbl":"btl","btc":"bcr","bbc":"bcl","btr":"bbr","bcr":"bbc","bbr":"bbl","bcc":"bcc"
        }
    };

    var plane_list = {
        U1: "white", U2: "white", U3: "white", U4: "white", U5: "white", U6: "white", U7: "white", U8: "white", U9: "white",
        F1: "blue", F2: "blue", F3: "blue", F4: "blue", F5: "blue", F6: "blue", F7: "blue", F8: "blue", F9: "blue",
        D1: "yellow", D2: "yellow", D3: "yellow", D4: "yellow", D5: "yellow", D6: "yellow", D7: "yellow", D8: "yellow", D9: "yellow",
        B1: "green", B2: "green", B3: "green", B4: "green", B5: "green", B6: "green", B7: "green", B8: "green", B9: "green",
        L1: "orange", L2: "orange", L3: "orange", L4: "orange", L5: "orange", L6: "orange", L7: "orange", L8: "orange", L9: "orange",
        R1: "red", R2: "red", R3: "red", R4: "red", R5: "red", R6: "red", R7: "red", R8: "red", R9: "red",
    };

    var init_list = Object.assign({}, plane_list);

    var side_list = ["F", "B", "U", "D", "L", "R"];
    var color_list = ["blue", "green", "white", "yellow", "orange", "red"];

    var side_key = {
        U1: "utl cubie up LM UE BS",
        U2: "ucl cubie up LM UE CS",
        U3: "ubl cubie up LM UE FS",
        U4: "utc cubie up CM UE BS",
        U5: "ucc cubie up CM UE CS",
        U6: "ubc cubie up CM UE FS",
        U7: "utr cubie up RM UE BS",
        U8: "ucr cubie up RM UE CS",
        U9: "ubr cubie up RM UE FS",

        F1: "ftl cubie front LM UE FS",
        F2: "fcl cubie front LM CE FS",
        F3: "fbl cubie front LM DE FS",
        F4: "ftc cubie front CM UE FS",
        F5: "fcc cubie front CM CE FS",
        F6: "fbc cubie front CM DE FS",
        F7: "ftr cubie front RM UE FS",
        F8: "fcr cubie front RM CE FS",
        F9: "fbr cubie front RM DE FS",

        D1: "dtl cubie down LM DE FS",
        D2: "dcl cubie down LM DE CS",
        D3: "dbl cubie down LM DE BS",
        D4: "dtc cubie down CM DE FS",
        D5: "dcc cubie down CM DE CS",
        D6: "dbc cubie down CM DE BS",
        D7: "dtr cubie down RM DE FS",
        D8: "dcr cubie down RM DE CS",
        D9: "dbr cubie down RM DE BS",

        B1: "btl cubie back LM DE BS",
        B2: "bcl cubie back LM CE BS",
        B3: "bbl cubie back LM UE BS",
        B4: "btc cubie back CM DE BS",
        B5: "bcc cubie back CM CE BS",
        B6: "bbc cubie back CM UE BS",
        B7: "btr cubie back RM DE BS",
        B8: "bcr cubie back RM CE BS",
        B9: "bbr cubie back RM UE BS",

        L1: "ltl cubie left LM UE BS",
        L2: "lcl cubie left LM CE BS",
        L3: "lbl cubie left LM DE BS",
        L4: "ltc cubie left LM UE CS",
        L5: "lcc cubie left LM CE CS",
        L6: "lbc cubie left LM DE CS",
        L7: "ltr cubie left LM UE FS",
        L8: "lcr cubie left LM CE FS",
        L9: "lbr cubie left LM DE FS",

        R1: "rtl cubie right RM UE FS",
        R2: "rcl cubie right RM CE FS",
        R3: "rbl cubie right RM DE FS",
        R4: "rtc cubie right RM UE CS",
        R5: "rcc cubie right RM CE CS",
        R6: "rbc cubie right RM DE CS",
        R7: "rtr cubie right RM UE BS",
        R8: "rcr cubie right RM CE BS",
        R9: "rbr cubie right RM DE BS"
    }

    var INIT_CONFIG = {
        "front":"blue",
        "back":"green",
        "up":"white",
        "down":"yellow",
        "left":"orange",
        "right":"red"
    };

    function Rubik (cfg) {
        this._init(cfg || {});
        this._bind();
        this._setInitialPosition(cfg);
    }
    Rubik.prototype = {
        _init: function (cfg) {
            this._container = Y.one(cfg.container || '#cube-container');
            this.movementcount = 0;
            this._cube = Y.one(cfg.src || '#cube');
            this._plane = Y.Node.create('<div id="plane"></div>');
            this._controls = Y.one(cfg.controls || '#cube-controls');
            this._rotation = Y.one(cfg.controls || '#rotation');
            this._messages = Y.one(cfg.messages || '#messages');
            this._tutorial = Y.one(cfg.messages || '#tutorial');
            this._solve = Y.one(cfg.solve || '.solve');
            this._undo = Y.one(cfg.undo || '.undo');
            this._redo = Y.one(cfg.redo || '.redo');
            this._scramble = Y.one(cfg.scramble || '.scramble');
            this._queue = new Y.Queue();
            this._cube.append(this._plane);
            this._expectingTransition = false;
            this._setScroll();
        },
        /*
        * We use the YUI gesture which allows to abstract the click/tap
        * so it works with the mouse click or with tap/flick gestures.
        */
        _bind: function () {
            //TODO: Fix YUI bug to abstract transitionEnd
           this._cube.on('transitionend',this._endTransition,this);
           this._cube.on('webkitTransitionEnd',this._endTransition,this);

           this._container.on('gesturemovestart',this._onTouchCube,{preventDefault:true},this);
           this._container.on('gesturemove',this._onMoveCube,{preventDefault:true},this);
           this._container.on('gesturemoveend',this._onEndCube,{preventDefault:true},this);

           this._container.on('gesturestart',this._multiTouchStart,this);
           this._container.on('gesturechange',this._multiTouchMove,this);
           this._container.on('gestureend',this._multiTouchEnd,this);

           this._solve.on('gesturemovestart',this._solveFake,{preventDefault:true},this);
           this._undo.on('gesturemovestart',this._undoMove,{preventDefault:true},this);
           this._redo.on('gesturemovestart',this._redoMove,{preventDefault:true},this);
           this._scramble.on('gesturemovestart',this._scrambleCube,{preventDefault:true},this);

           if (Y.UA.mobile) {
                //this._rotation.on('gesturestart',this._onRotationFocus,this);
                //this._rotation.on('gestureend',this._onRotationBlur,this);
                //we support it by default:
                this._enableRotation = true;
            } else {
                this._rotation.on('click',this._onRotationToggle,this);
                Y.on('keypress',Y.bind(this._keyPress,this));
            }

           Y.on('orientationchange',Y.bind(this._changeOrientation,this));
           Y.one('body').on('gesturemovestart',this._checkScroll,{},this);
        },
        _keyPress: function (e) {
            e.halt();
            if (e.charCode == 114) {
                this._onRotationToggle();
            }
            return;
        },
        _undoMove: function (e) {
            if(scrambleBool == false){
              if (this._moving)return;
              var movement = this._queue.undo();
              this._expectingTransition = true;
              movement && this._doMovement(movement, true);
              return movement;
            }
            else if (scrambleBool == true){
              // window.alert("In undomove");
              if(this.moving) return;
              var moveList = [{face: "L", slice: "M", rotate: "right"},
                              {face: "U", slice: "E", rotate: "left"},
                              {face: "R", slice: "M", rotate: "left"},
                              {face: "F", slice: "S", rotate: "right"},
                              {face: "B", slice: "S", rotate: "right"},
                              {face: "L", slice: "M", rotate: "left"},
                              {face: "L", slice: "M", rotate: "left"},
                              {face: "B", slice: "S", rotate: "left"},
                              {face: "R", slice: "M", rotate: "left"},
                              {face: "U", slice: "E", rotate: "left"},
                              {face: "D", slice: "E", rotate: "left"},
                              {face: "D", slice: "S", rotate: "left"},
                              {face: "B", slice: "S", rotate: "right"},
                              {face: "B", slice: "S", rotate: "right"},
                              {face: "U", slice: "E", rotate: "left"}, // count = 15
                              // white cross
                              {face: "U", slice: "E", rotate: "left"},
                              {face: "B", slice: "S", rotate: "right"},
                              {face: "R", slice: "M", rotate: "right"},
                              {face: "U", slice: "E", rotate: "right"},
                              {face: "F", slice: "S", rotate: "left"},
                              {face: "U", slice: "E", rotate: "right"},
                              {face: "F", slice: "S", rotate: "left"},
                              {face: "U", slice: "E", rotate: "left"},
                              {face: "U", slice: "E", rotate: "left"}, // count = 24

                              // corners
                              {face: "L", slice: "M", rotate: "left"},
                              {face: "D", slice: "E", rotate: "left"},
                              {face: "L", slice: "M", rotate: "right"},

                              {face: "D", slice: "E", rotate: "right"},
                              {face: "B", slice: "S", rotate: "right"},
                              {face: "D", slice: "E", rotate: "left"},
                              {face: "B", slice: "S", rotate: "left"},

                              {face: "D", slice: "E", rotate: "right"},
                              {face: "L", slice: "M", rotate: "right"},
                              {face: "D", slice: "E", rotate: "right"},
                              {face: "L", slice: "M", rotate: "left"},

                              {face: "B", slice: "S", rotate: "left"},
                              {face: "D", slice: "E", rotate: "right"},
                              {face: "B", slice: "S", rotate: "right"} // count = 38
                            ];
              var move = moveList[counter];
              this._expectingTransition = true;
              move && this._doMovement(move, false);
              return move;
            }
        },


      //  function myFunction() {
      //      var number = 77;
        //    document.getElementById("myText").innerHTML = number;
      //  }
        _redoMove: function (e) {
            if (this._moving)return;
            var movement = this._queue.redo();
            this._expectingTransition = true;
            movement && this._doMovement(movement, true);
        },

        _solveFake: function (){
          this._solving = Y.later(350,this,function (){
            var m = this._undoMove();
          if(!m){
            this._solving.cancel();
           }
          },null,true);
        },
        _scrambleCube: function() {
            scrambleBool = true;
            this._solving = Y.later(350,this,function (){
                var m = this._undoMove();
                counter++;
                if(!m || counter==15){
                    scrambleBool=false;
                    this._solving.cancel();
                    counter=0;
                }
            },null,true);
        },
        _changeOrientation: function (evt) {
            this._setScroll();
            this._portrait = window.orientation === 0 ? this._changeToPortrait() : this._changeToLandscape();
        },
        _onRotationFocus: function ()  {
            this._enableRotation = true;
        },
        _onRotationBlur: function ()  {
          this._enableRotation = false;
        },
        //handler only for non-touch/gesture devices
        _onRotationToggle: function ()  {
            var enabled = this._enableRotation;
            if (enabled) {
               this._rotation.removeClass('pcRotation');
            } else {
                 this._rotation.addClass('pcRotation');
            }
            this._enableRotation = !enabled;
            this._gesture = !enabled;
        },
        _setScroll: function (evt) {
            self = this;
            setTimeout(function () {
                window.scrollTo(0,1);
            },1);
        },
        _checkScroll: function (evt) {
            this._setScroll();
        },
        _setInitialPosition: function (cfg) {
            this._setInitialColors();
            //TODO: set as a configurable ATTR on instanciation
            var pos = cfg && cfg.position || {x: 30, y: -30 };
            this._cube.setStyle('transform','rotateX('+ pos.y + 'deg) rotateY(' +pos.x + 'deg)');

            this._cubeXY = pos;
            this._tempXY = pos;
        },
        _setInitialColors: function (){
            for(var face in INIT_CONFIG){
                Y.all('.' + face + ' > div').addClass(INIT_CONFIG[face]);
            }
        },
        _endTransition: function (evt) {
            if (this._expectingTransition){
                evt.halt();
                this._plane.set('className',"");
                this._reorganizeCubies();
                this._reorientCubies();
                this._updatePlaneList();
                // this._crossCheck();
                this._VCheck();
                // this._behaviorTree();
                this._detachToPlane();
                this._moving = false;
                this._expectingTransition = false;
            }
        },
        // AI portion, we do checks and call functions here
        _behaviorTree: function() {
          if(4 == 4){
              console.log("4 works. dummy test");
              setfourtobetrue();
           }
          if(this._crossCheck("white")) {
            // change text
            console.log("testing crosscheck");
            setdivonetobetrue();
          }
          if(this._cornerCheck("white",4)) {
            // change text
             console.log("corner check complete");
             setdivtwotobetrue();
          }

          if(this._crossCheck() && this._cornerCheck()) {
            this._faceCheck() = true;
            // change text
             console.log("testing facecheck");
             setdivthreetobetrue();
          }



          if(this._middleCheck()) {
            // change text
            console.log("testing middlecheck");
          }

        },
        /*
        * We got the first finger/click on the cube
        * Save the position.
        */
        _onTouchCube:function (evt) {

            evt.halt();
            this._tempCubie = evt.target.ancestor('.cubie');
            this._startX = evt.clientX;
            this._startY = evt.clientY;
            this._deltaX = 0;
            this._deltaY = 0;
        },
        /*
        * Getting a mouse/double-finger moving. We need to update the rotation(XY) of the cube
        * We need to add some logic due to the mouse.
        * This function gets triggered if a gesture/click is present
        */
        _onMoveCube:function (evt) {
            // not sure what this does but it looks like it checks where i'm clicking
            evt.halt();
            //TODO set rate move as a constant.
            var deltaX = this._deltaX = ((evt.clientX - this._startX)/1.2),
            deltaY = this._deltaY = ((evt.clientY - this._startY)/1.2),
            x = this._cubeXY.x + deltaX;
            y = this._cubeXY.y - deltaY;
            if (this._gesture){
                this._tempXY = {x: x, y:y};
                this._moved = true;
                this._cube.setStyle('transform','rotateX('+ y  + 'deg) rotateY(' + x + 'deg)');
            }else{
                this._moved = false;
            }
        },
        /*
        * All magic happen here. We have to check how the use flick his finger, in which side,
        */
        _onEndCube:function (evt) {
            //if gesture we dont do movement
            if (this._gesture || this._moved || !this._tempCubie) {
                this._gesture = false;
                this._moved = false;
                if (!Y.UA.mobile){
                    this._onRotationToggle();
                    this._multiTouchEnd(evt);
                }
                return;
            }
            evt.halt();
            if (!this._deltaX && !this._deltaY)return; // if we dont move we dont do nothing
            this._tempXY = {x: this._tempXY.x % 360, y: this._tempXY.y % 360 };// to get controlled the degrees
            var threshold = 70,//ToDo: Double check this value in different devices
                movement,swap,
                rotateX = this._deltaX > 0 ? "right" :"left",
                rotateXInverted = rotateX == "right" ? "left": "right",
                deg = Math.abs(this._tempXY.x),
                rotateY = this._deltaY > 0 ? "right" : "left",
                rotateYInverted = rotateY == "right" ? "left": "right",
                rotateBoth = Math.abs(this._deltaX) > threshold && Math.abs(this._deltaY) > threshold;
                mHorizontal = Math.abs(this._deltaX) > Math.abs(this._deltaY),
                parts = this._tempCubie.get('className').split(' ');
                this._expectingTransition = true;
             // We will have to translate the finger movements to the cube movements
             //(implies transform 2D dimension into -> 3D)
            switch(true){
                //E Movements:
                //Front, left, right, back in E (left or right) direction
                case parts[2] != "up" && parts[2] != "down" && mHorizontal:
                    movement = {face: parts[4].charAt(0),slice: parts[4].charAt(1),rotate: rotateX};
                    break;
                //up and down in E ( we have to adjust the 3D rotation tu a 2D plane:
                case (parts[2] == "up" || parts[2] == "down") && mHorizontal && deg>= -45 &&  deg<45:
                    if (parts[2] == "down"){swap = rotateX; rotateX = rotateXInverted; rotateXInverted = swap;}
                    movement = {face: parts[5].charAt(0),slice: parts[5].charAt(1),rotate: rotateX};
                    break;

                case (parts[2] == "up" || parts[2] == "down") && mHorizontal && deg>= 45 &&  deg< 135:
                    if (parts[2] == "down"){swap = rotateX; rotateX = rotateXInverted; rotateXInverted = swap;}
                    movement = {face: parts[3].charAt(0),slice: parts[3].charAt(1),rotate: this._tempXY.x < 0 ? rotateXInverted: rotateX};
                    break;

                case (parts[2] == "up" || parts[2] == "down") && mHorizontal && deg>= 135 && deg < 225:
                    if (parts[2] == "down"){swap = rotateX; rotateX = rotateXInverted; rotateXInverted = swap;}
                    movement = {face: parts[5].charAt(0),slice: parts[5].charAt(1),rotate: rotateXInverted};
                    break;

                case (parts[2] == "up" || parts[2] == "down") && mHorizontal && deg>= 225 && deg < 315:
                    if (parts[2] == "down"){swap = rotateX; rotateX = rotateXInverted; rotateXInverted = swap;}
                    movement = {face: parts[3].charAt(0),slice: parts[3].charAt(1),rotate: this._tempXY.x < 0 ?rotateX: rotateXInverted};
                    break;

                //M movements:

                //front and back
                case (parts[2] == "front" || parts[2] == "back") && !mHorizontal:
                    if (parts[2] == "back"){swap = rotateY; rotateY = rotateYInverted; rotateYInverted = swap;}
                    movement = {face: parts[3].charAt(0),slice: parts[3].charAt(1),rotate: rotateY};
                    break;
                //right and left
                case (parts[2] == "right" || parts[2] == "left") && !mHorizontal:
                    if (parts[2] == "left"){swap = rotateY; rotateY = rotateYInverted; rotateYInverted = swap;}
                    movement = {face: parts[5].charAt(0),slice: parts[5].charAt(1),rotate: rotateY};
                    break;
                //up & down:
                case (parts[2] == "up" || parts[2] == "down") && !mHorizontal && deg>= -45 &&  deg<45:
                    movement = {face: parts[3].charAt(0),slice: parts[3].charAt(1),rotate: rotateY};
                    break;

                case (parts[2] == "up" || parts[2] == "down") && !mHorizontal && deg>= 45 &&  deg<135:
                    movement = {face: parts[5].charAt(0),slice: parts[5].charAt(1),rotate: rotateYInverted};
                    break;

                case (parts[2] == "up" || parts[2] == "down") && !mHorizontal && deg>= 135 &&  deg<225:
                    movement = {face: parts[3].charAt(0),slice: parts[3].charAt(1),rotate: rotateYInverted};
                    break;

                case (parts[2] == "up" || parts[2] == "down") && !mHorizontal && deg>= 225 &&  deg<315:
                    movement = {face: parts[5].charAt(0),slice: parts[5].charAt(1),rotate: rotateY};
                    break;

                default: break;
             }
             //this._gesture = false;//finish all touching
            if (movement)
                this._doMovement(movement);
        },

        _multiTouchStart:function (evt) {
            evt.halt();
            this._startX = evt.clientX || evt.pageX;
            this._startY = evt.clientY || evt.pageY;
            this._gesture = true;
        },
        _multiTouchMove:function (evt) {
            if (this._portrait || !this._enableRotation)return;

            evt.clientX = evt.pageX;
            evt.clientY = evt.pageY;
            this._onMoveCube(evt);
        },
        _multiTouchEnd:function (evt) {
            this._gesture = false;
            evt.halt();
            this._cubeXY.x = this._tempXY.x;
            this._cubeXY.y = this._tempXY.y;
        },
        //  var movmentcount =parseInt("10");
        _doMovement:function (m,fromQueue) {
            this.movementcount++;
            counterformovement = counterformovement +1  ;
            myFunction(); // this function updates counterformovement in html

            //console.log("doMovement: m: ", m);
            // fromQueue is true when I press undo and redo
            // -> meaning it is undefined when i click on the cube
            if (this._moving)return;//we cancel if there is some movement going on
            //save the movement if doesnt came from the queue.
            if(!fromQueue){
                this._queue.add(m);
            }
            var plane = this._plane,
                list = Y.all('.' + m.face + m.slice),
                origin;
            this._movement = m;
            this._moving = true;
            this._attachToPlane(list);

            switch (m.slice) {
                case 'M' : origin = '0 200px'; break;
                case 'S'  : origin = '200px 200px'; break;
                default : origin = '';
            }

            plane.setStyle('-webkit-transform-origin', origin);
            plane.get('offsetHeight');
            plane.addClass('moving');
            plane.addClass(m.slice +'-'+ m.rotate);
        },
        _attachToPlane:function (list) {
            this._plane.setContent(list);
        },
        _detachToPlane:function () {
            var children = this._plane.get('children');
            this._cube.append(children);
        },
        _reorganizeCubies:function () {
            var m = this._movement,
                changes = CUBIE_MOVEMENTS[m.face + m.slice +'-' +m.rotate],
                list = this._plane.get('children'),
                tempCubies = {};
                list.each(function (originCube,i) {
                    if (originCube.hasClass('face'))return;
                    //get the class and the position of the cubie
                    var originCubeClass = originCube.get('className'),
                        cubePos = (originCubeClass.split(' ',1))[0];
                    //we keep te original position and class
                    tempCubies[cubePos] = originCubeClass;

                    //we try to find the cube to swap position
                    var destCube = Y.one('.' + changes[cubePos]);

                    // if we dont find it, we already swap that cubie, we have to find the original css class in temp.
                    var destCubeClass = destCube? destCube.get('className'): tempCubies[changes[cubePos]],
                        cubePosDes = destCubeClass.split(' ',1)[0];

                   //swap position of the cubie acording to the movement.
                    originCube.set('className', cubePosDes + destCubeClass.substr(3));
                });
        },
        _changeTextOrientation:function (elm,rotation) {
            var state = elm.get('className'),txt = state.split(' ',2),color = txt[0] + " ";
            txt= txt[1] || txt[0];
            // commenting this out because it's just too unneccessary, we don't care about orientation
            // switch(txt){
            //     case "textLeft": elm.replaceClass(txt, rotation == "left" ? 'textDown' : '');break;
            //     case "textRight":elm.replaceClass(txt, rotation == "left" ? '' : 'textDown');break;
            //     case "textDown": elm.replaceClass(txt, rotation == "left" ? 'textRight' : 'textLeft');break;
            //     default: elm.set('className',color + (rotation == "left" ? 'textLeft' : 'textRight') );break;
            // }
        },
        //Reorient the content inside the cubics
        _reorientCubies:function () {
            var plane = this._plane,
                cubies = plane.get('children'),
                m = this._movement;

            switch(true){
                case m.face == "C" && m.slice == "S":
                case m.face == "F" && m.slice == "S":
                    cubies.each(function (e) {
                        this._changeTextOrientation(e.one('*'),m.rotate);
                    },this);
                    break;

                case m.face == "B" && m.slice == "S":
                    cubies.filter('.back').each(function (e) {
                        this._changeTextOrientation(e.one('*'),m.rotate == "left"? "right":"left" );
                    },this);
                    cubies.filter(':not(.back)').each(function (e) {
                        this._changeTextOrientation(e.one('*'),m.rotate);
                    },this);
                    break;

                case m.face == "L" && m.slice == "M":
                    cubies.filter('.left').each(function (e) {
                        this._changeTextOrientation(e.one('*'),m.rotate);
                    },this);
                    break;

                case m.face == "R" && m.slice == "M":
                    cubies.filter('.right').each(function (e) {
                        this._changeTextOrientation(e.one('*'),m.rotate =="left"? "right":"left");
                    },this);
                    break;

                case m.face =="C" && m.slice == "E" && m.rotate =="left":
                case m.face =="U" && m.slice == "E" && m.rotate =="left":
                    cubies.filter('.up').each(function (e) {
                        this._changeTextOrientation(e.one('*'),m.rotate =="left"? "right":"left");
                    },this);
                    cubies.filter('.back').each(function (e) {
                        this._changeTextOrientation(e.one('*'),m.rotate);
                        this._changeTextOrientation(e.one('*'),m.rotate);
                    },this);
                    cubies.filter('.right').each(function (e) {
                        this._changeTextOrientation(e.one('*'),m.rotate);
                        this._changeTextOrientation(e.one('*'),m.rotate);
                        },this);
                    break;

                case m.face =="C" && m.slice == "E" && m.rotate =="right":
                case m.face =="U" && m.slice == "E" && m.rotate =="right":
                    cubies.filter(function (i) {
                        return i.className.indexOf('up') !== -1;
                    }).each(function (e) {
                        this._changeTextOrientation(e.one('*'),m.rotate =="left"? "right":"left");
                    },this);
                    cubies.filter(function (i) {
                        return i.className.indexOf('back') !== -1;
                    }).each(function (e) {
                        this._changeTextOrientation(e.one('*'),m.rotate);
                        this._changeTextOrientation(e.one('*'),m.rotate);
                    },this);
                    cubies.filter(function (i) {
                        return i.className.indexOf('left') !== -1;
                    }).each(function (e) {
                        this._changeTextOrientation(e.one('*'),m.rotate);
                        this._changeTextOrientation(e.one('*'),m.rotate);
                    },this);
                    break;

                case m.face =="D" && m.slice == "E" && m.rotate =="right":
                    cubies.filter('.down').each(function (e) {
                        this._changeTextOrientation(e.one('*'),m.rotate);
                    },this);
                    cubies.filter('.back').each(function (e) {
                        this._changeTextOrientation(e.one('*'),m.rotate);
                        this._changeTextOrientation(e.one('*'),m.rotate);
                    },this);
                    cubies.filter('.left').each(function (e) {
                        this._changeTextOrientation(e.one('*'),m.rotate);
                        this._changeTextOrientation(e.one('*'),m.rotate);
                    },this);
                    break;

                case m.face =="D" && m.slice == "E" && m.rotate == "left":
                    cubies.filter('.down').each(function (e) {
                        this._changeTextOrientation(e.one('*'),m.rotate);
                    },this);
                    cubies.filter('.back').each(function (e) {
                        this._changeTextOrientation(e.one('*'),m.rotate);
                        this._changeTextOrientation(e.one('*'),m.rotate);
                    },this);
                    cubies.filter('.right').each(function (e) {
                        this._changeTextOrientation(e.one('*'),m.rotate);
                        this._changeTextOrientation(e.one('*'),m.rotate);
                    },this);
                    break;
                default: break;
            }
        },
        // updates positions of all the planes
        // function that makes a list of all the planes and attaches color to them
        _updatePlaneList: function () {
            changed_cubes = this._cube.get('children');
            planes = changed_cubes.get("innerHTML");
            //console.log(planes)
            new_list = plane_list;
            for (i=0; i<planes.length; i++) {
                classes = planes[i].split("\"><span>");
                //if you're that one funky line that lists all the changed planes
                if (classes.length > 2) {
                    changes = planes[i].split("</div></div>")
                    for (j=0; j<changes.length; j++) {
                        changed_plane = changes[j].split("\"");
                        side = changed_plane[1]
                        if (changed_plane[5] != undefined){
                            color = changed_plane[5]
                        }else{
                            color = changed_plane[3]
                        }
                        //console.log(changed_plane);
                        //init_position = changed_plane[6].replace("</span>", ")
                        temp_position = this._getKeyByValue(side_key, side);
                        //console.log(temp_position)
                        new_list[temp_position] = (color);
                    }
                // }else{
                //      color = classes[0].replace("<div class=\"", "")
                //      side = classes[1].replace("</span></div>", "")
                //      new_list[side] = color
                }
            }
            //console.log(new_list);
            //return new_list;
            this._behaviorTree(); // added by anthony 11:17am december 9
        },
        _getKeyByValue: function(object, value) {
            return Object.keys(object).find(key => object[key] === value);
        },
        _getOppositeSide: function(main_side) {
            if (main_side == "F") return "B"
            else if (main_side == "B") return "F"
            else if (main_side == "U") return "D"
            else if (main_side == "D") return "U"
            else if (main_side == "L") return "R"
            else if (main_side == "R") return "L"
        },
        // returns a list of adjacent sides in the order of above, below, left, right and planes left to right, top to bottom
        _getAdjacentSides: function(main_side) {
            if (main_side == "F") adjacent_list = ["U", "D", "L", "R", "U3", "U6", "U9","D1", "D4", "D7", "L7", "L8", "L9", "R1", "R2", "R3"]
            else if (main_side == "B") adjacent_list = ["D", "U", "L", "R", "D3", "D6", "D9", "U1", "U4", "U7", "L3", "L2", "L1", "R9", "R8", "R7"]
            else if (main_side == "U") adjacent_list = ["B", "F", "L", "R", "B3", "B6", "B9", "F1", "F4", "F7", "L1", "L4", "L7", "R7", "R4", "R1"]
            else if (main_side == "D") adjacent_list = ["F", "B", "L", "R", "F3", "F6", "F9", "B1", "B4", "B7", "L9", "L6", "L3", "R3", "R6", "R9"]
            else if (main_side == "L") adjacent_list = ["U", "D", "B", "F", "U1", "U2", "U3", "D3", "D2", "D1", "B3", "B2", "B1", "F1", "F2", "F3"]
            else if (main_side == "R") adjacent_list = ["U", "D", "F", "B", "U9", "U8", "U7", "D9", "D6", "D3", "F7", "F8", "F9", "B9", "B8", "B7"]
            return adjacent_list
        },
        //returns a list of the "middle" layer in the order of above, below, left, right and the LM and RM planes
        _getMiddleEdges: function(main_side) {
            // returns a list of adjacent sides in the order of above, below, left, right and planes left to right, top to bottom
            if (main_side == "F") adjacent_list = ["U", "D", "L", "R", "U8", "U2", "D2", "D8", "L4", "L6", "R6", "R4"]
            else if (main_side == "B") adjacent_list = ["D", "U", "L", "R", "D6", "D2", "U2", "U6", "L6", "L4", "R4", "R6"]
            else if (main_side == "U") adjacent_list = ["B", "F", "L", "R", "B8", "B2", "F2", "F8", "L2", "L8", "R8", "R2"]
            else if (main_side == "D") adjacent_list = ["F", "B", "L", "R", "F8", "F2", "B2", "B8", "L8", "L2", "R2", "R8"]
            else if (main_side == "L") adjacent_list = ["U", "D", "B", "F", "U6", "U4", "D6", "D4", "B6", "B4", "F6", "F4"]
            else if (main_side == "R") adjacent_list = ["U", "D", "F", "B", "U4", "U6", "D4", "D6", "F4", "F6", "B4", "B6"]
            return adjacent_list
        },
        //returns true if there is a cross in the Rubik's cube, you can specify the color, to keep
        _crossCheck: function(temp_color) {
            int_list = [2, 4, 5, 6, 8];
            for (side in side_list) {
                temp_side = side_list[side];
                temp_color = temp_color || plane_list[temp_side + int_list[0]];
                // function that checks if one side has a cross of all the same colors, returns with the first one found
                function crosses(plane) {
                    return (plane_list[temp_side + plane] == temp_color);
                }
                if (int_list.every(crosses)){
                    console.log("there is a " + temp_color + " cross!");
                    return true;
                }
            }
            return false;
        },
        //returns true if there is a "V" on one of the given side in the Rubik's cube
        //for now it will be specifically for the yellow side, but I assume it's to be the opposite side of the first solved color
        _VCheck: function(first_color) {
            // we have to manually find what's the opposite side
            for (side in side_list) {
                if (plane_list[side_list[side] + "5"] == first_color) {
                    temp_side = this._getOppositeSide(side_list[side]);
                }
            }
            temp_color = plane_list[temp_side + "5"];
            // up and left plane
            if ( plane_list[temp_side + "4"] == temp_color && plane_list[temp_side + "2"] == temp_color ) return true
            // up and right plane
            else if ( plane_list[temp_side + "4"] == temp_color && plane_list[temp_side + "8"] == temp_color ) return true
            // down and left plane
            else if ( plane_list[temp_side + "6"] == temp_color && plane_list[temp_side + "2"] == temp_color ) return true
            // down and right plane
            else if ( plane_list[temp_side + "6"] == temp_color && plane_list[temp_side + "8"] == temp_color ) return true

            else return false
        },
        _faceCheck: function(temp_color) {
            if (this._crossCheck(temp_color) && this._cornerCheck(temp_color)) {
                console.log(temp_color + " face is solved!")
                return true
            }
            return false
        },
        //straightCheck returns true when there is a "straight" pattern on the side
        _straightCheck: function(first_color) {
            // we have to manually find what's the opposite side
            for (side in side_list) {
                if (plane_list[side_list[side] + "5"] == first_color) {
                    temp_side = this._getOppositeSide(side_list[side]);
                }
            }
            temp_color = plane_list[temp_side + "5"];
            // horizontal check
            if ( plane_list[temp_side + "2"] == temp_color && plane_list[temp_side + "8"] == temp_color ) return true
            // vertical check
            else if ( plane_list[temp_side + "4"] == temp_color && plane_list[temp_side + "6"] == temp_color ) return true

            else return false
        },
        //middleCheck checks if all the cubes in the middle layer is in the right position
        _middleCheck: function() {
            //white is still assumed to be the first side to be finished but you can change this
            temp_color = "white";
            for (i=0; i<color_list.length; i++){
                if (color_list[i] == temp_color) {
                    temp_side = side_list[i];
                }
            }
            //console.log(plane_list)
            middle_list = this._getMiddleEdges(temp_side)
            // side above: left edge + right edge
            if (plane_list[middle_list [4]] != (plane_list[middle_list [0] + "5"]) ||
                plane_list[middle_list [5]] != (plane_list[middle_list [0] + "5"]) ) {
                    //console.log(middle_list [4], middle_list [5]);
                    //console.log(plane_list[middle_list [4]], plane_list[middle_list [5]]);
                    return false
            }
            //console.log("side above")
            // side below: left edge + right edge
            if (plane_list[middle_list [6]] != (plane_list[middle_list [1] + "5"]) ||
                plane_list[middle_list [7]] != (plane_list[middle_list [1] + "5"]) ) {
                    console.log(plane_list[middle_list [6]], plane_list[middle_list [7]]);
                    return false
            }
            //console.log("side below")
            // side left left edge + right edge
            if (plane_list[middle_list [8]] != (plane_list[middle_list [2] + "5"]) ||
                plane_list[middle_list [9]] != (plane_list[middle_list [2] + "5"]) ) {
                    console.log(plane_list[middle_list [8]], plane_list[middle_list [9]]);
                    return false
            }
            //console.log("side left")
            // side right: left edge + right edge
            if (plane_list[middle_list [10]] != (plane_list[middle_list [3] + "5"]) ||
                plane_list[middle_list [11]] != (plane_list[middle_list [3] + "5"]) ) {
                    console.log(plane_list[middle_list [10]], plane_list[middle_list [11]]);
                    return false
            }
            console.log("middle layer is complete!");
            return true
        },
        //crossPlusOne checks if there is a cross and one corner of the same color, corner doesn't have to be in the right place
        _crossPlusOne: function(first_color) {
            // we have to manually find what's the opposite side
            for (side in side_list) {
                if (plane_list[side_list[side] + "5"] == first_color) {
                    temp_side = this._getOppositeSide(side_list[side]);
                }
            }
            temp_color = plane_list[temp_side + "5"];
            // top left corner
            if ( this._crossCheck(temp_color) && plane_list[temp_side + "1"] == temp_color ) return true
            // top right corner
            else if ( this._crossCheck(temp_color) && plane_list[temp_side + "3"] == temp_color ) return true
            // bottom left corner
            else if ( this._crossCheck(temp_color) && plane_list[temp_side + "7"] == temp_color ) return true
            // bottom right corner
            else if ( this._crossCheck(temp_color) && plane_list[temp_side + "9"] == temp_color ) return true

            else return false
        },
        //crossPlusTwo checks if there is a cross and two corners of the same color, corners doesn't have to be in the right place
        _crossPlusTwo: function(first_color) {
            // we have to manually find what's the opposite side
            for (side in side_list) {
                if (plane_list[side_list[side] + "5"] == first_color) {
                    temp_side = this._getOppositeSide(side_list[side]);
                }
            }
            temp_color = plane_list[temp_side + "5"];
            corners = 0
            // top left corner
            if ( plane_list[temp_side + "1"] == temp_color ) corners++
            // top right corner
            if ( plane_list[temp_side + "3"] == temp_color ) corners++
            // bottom left corner
            if ( plane_list[temp_side + "7"] == temp_color ) corners++
            // bottom right corner
            if ( plane_list[temp_side + "9"] == temp_color ) corners++

            return ( this._crossCheck(temp_color) && corners >= 2 )
        },
        //cornerCheck ideally will take in a face color but for now it's set as "white", we're solving white corners first
        _cornerCheck: function(temp_color, corner_req) {
            temp_color = temp_color || "white";
            for (i=0; i<color_list.length; i++){
                if (color_list[i] == temp_color) {
                    temp_side = side_list[i];
                }
            }
            corners = 0;
            //console.log(plane_list)
            adj_list = this._getAdjacentSides(temp_side)
            // top-left corner + above + left
            if (plane_list[temp_side + "1"] != (plane_list[temp_side + "5"]) ||
                plane_list[adj_list[4]] != (plane_list[adj_list[0] + "5"]) ||
                plane_list[adj_list[10]] != (plane_list[adj_list[2] + "5"]) ) {
                    //console.log(plane_list[temp_side + "1"], plane_list[adj_list[4]], plane_list[adj_list[10]]);
                    corners++
            }
            //console.log("top-left")
            // top-right corner + above + right
            if (plane_list[temp_side + "7"] != (plane_list[temp_side + "5"]) ||
                plane_list[adj_list[6]] != (plane_list[adj_list[0] + "5"]) ||
                plane_list[adj_list[13]] != (plane_list[adj_list[3] + "5"]) ) {
                    //console.log(plane_list[temp_side + "7"], plane_list[adj_list[6]], plane_list[adj_list[13]])
                    corners++
            }
            //console.log("top-right")
            // bottom-left corner + below + left
            if (plane_list[temp_side + "3"] != (plane_list[temp_side + "5"]) ||
                plane_list[adj_list[7]] != (plane_list[adj_list[1] + "5"]) ||
                plane_list[adj_list[12]] != (plane_list[adj_list[2] + "5"]) ) {
                    //console.log(plane_list[temp_side + "3"], plane_list[adj_list[7]], plane_list[adj_list[12]])
                    corners++
            }
            //console.log("bottom-left")
            // bottom-right corner + below + right
            if (plane_list[temp_side + "9"] != (plane_list[temp_side + "5"]) ||
                plane_list[adj_list[9]] != (plane_list[adj_list[1] + "5"]) ||
                plane_list[adj_list[15]] != (plane_list[adj_list[3] + "5"]) ) {
                    //console.log(plane_list[temp_side + "9"], plane_list[adj_list[9]], plane_list[adj_list[15]])
                    corners++
            }
            return corners >= corner_req
        },
        _solveCheck: function() {
            for (side in side_list) {
                temp_side = side_list[side];
                temp_color = plane_list[temp_side + "1"];
                for (i=1; i<=9; i++) {
                    //console.log(temp_side, temp_color);
                    if (plane_list[temp_side + i] != temp_color) {
                        //console.log("not solved")
                        return false
                    }
                }
            }
            console.log("solved!");
            return true
        },
        _startRotationMode: function () {
            if (window.DeviceOrientationEvent) {
                this._tempXY = {x:-20,y:50};
                this._rotationAttach = Y.bind(this._getRotation,this);
                window.addEventListener('deviceorientation',this._rotationAttach, false);
            }
        },
        _endRotationMode:function () {
            window.removeEventListener('deviceorientation',this._rotationAttach);
        },
        _getRotation: function (evt) {
            var tiltLR = this._tempXY.x + Math.round(evt.gamma* 1.4) ,
                tiltFR = this._tempXY.y - Math.round(evt.beta * 1.4) ,
                rotation = "rotateY(" + tiltLR + "deg) rotateX("+tiltFR +"deg)";
            //Y.one('#log > p').setContent(rotation);
            this._cube.setStyle('transform',rotation);
            //this._tempXY = {x: tiltFR,y: tiltLR};
        },
        _initPortrait:function () {
            var transformIn = {opacity: 1,duration: 2},
                css = {display: 'block'},
                cubeStyle = {
                    zoom: '1.20',
                    margin: '80px 180px',
                    display:'block'
                },
                self = this;
            this._startRotationMode();
            this._cube.setStyles(cubeStyle).transition(transformIn);
            this._tutorial.setStyles(css).transition(transformIn);

        },
        _changeToPortrait: function () {
            var css = {display: 'none'},
            cubeStyle = {
                    zoom: '1.20',
                    margin: '80px 180px',
                    display:'block'
                };

            //start gyroscope rotation
            this._startRotationMode();

            //show:
            Y.later(300,this,function () {
                this._tutorial.setStyles({display: 'block',opacity:1,bottom:'10px'});
            });

            //hide:
            this._messages.setStyles(css);
            this._controls.setStyles(css);
            this._cube.transition(cubeStyle);
            return true;
        },
        _initLandscape:function () {
            var transformIn = {opacity: 1,duration:2},
                css = {display: 'block'};

            this._cube.transition(transformIn);
            this._messages.setStyles(css).transition(transformIn);
            this._controls.setStyles(css).transition(transformIn);
        },
        _changeToLandscape:function () {
            //stop gyroscope rotation
            this._endRotationMode();

            var tr = {opacity:0},
                cssDisplayNone = {display: 'none'},
                cssDisplay = {display: 'block',opacity:1},
                cubeStyle = {
                    zoom: '0.85',
                    margin: '40px 110px'
                };

            //show
            this._cube.setStyles(cubeStyle);
            this._messages.setStyles(cssDisplay);
            this._controls.setStyles(cssDisplay);

            //hide
            this._tutorial.transition(tr,function () {
                this.setStyles(cssDisplayNone);
            });

            return false;//for the orientation(for sake of simplicity)
        },
        run:function () {
            var force;
            //force = true;
            if (force || (this._portrait = window.orientation === 0)){
                this._initPortrait();
            }else{
                this._initLandscape();
            }
        }
    };
Y.Rubik = Rubik;
},"0.0.1",{
    requires:['rubik-queue','yui-later','node','transition','event','event-delegate','event-gestures']
});


/*






*/
