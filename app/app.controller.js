(function(){
   "use strict";

    angular.module('seaquest').controller('SeaquestController',function($scope){


        var vm = this;
        vm.startGame = startGame;
        $scope.resgatados = 0;
        $scope.score = 0;

        var submarino;
        var obstacles = [];

        var myGameArea = new Game();

        function Game(){
            this.canvas = document.createElement("canvas");
            this.start = function() {
                this.canvas.width = 800;
                this.canvas.height = 400;
                this.frameNo = 0;
                this.context = this.canvas.getContext("2d");
                document.getElementById("canvas").insertBefore(this.canvas, document.getElementById("canvas").childNodes[0]);
                this.interval = setInterval(updateGameArea, 20);
                window.addEventListener('keydown', function (e) {
                    myGameArea.key = e.keyCode;
                });
                window.addEventListener('keyup', function () {
                    myGameArea.key = false;
                });
            };
            this.clear = function() {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            };
            this.stop = function() {
                clearInterval(this.interval);
            };
        }

        function startGame() {
            myGameArea.start();
            submarino = new Component(140, 40, "app/assets/img/submarino.png", 330, 180,'S');
        }

        function Component(width, height, image, x, y, type, flip) {
            this.type = type;
            this.image = new Image();
            this.image.src = image;
            this.width = width;
            this.height = height;
            this.speedX = 0;
            this.speedY = 0;
            this.flip = flip;
            this.x = x;
            this.y = y;

            this.update = function() {
                this.x += this.speedX;
                this.y += this.speedY;
                drawImage(this.image,this.x,this.y,this.flip);
            };

            this.crashWith = function(otherobj) {
                var myleft = this.x;
                var myright = this.x + (this.width);
                var mytop = this.y;
                var mybottom = this.y + (this.height);
                var otherleft = otherobj.x;
                var otherright = otherobj.x + (otherobj.width);
                var othertop = otherobj.y;
                var otherbottom = otherobj.y + (otherobj.height);
                var crash = true;
                if ((mybottom < othertop) ||
                    (mytop > otherbottom) ||
                    (myright < otherleft) ||
                    (myleft > otherright)) {
                    crash = false;
                }
                return crash;
            };
        }

        function updateGameArea(){

            myGameArea.clear();

            myGameArea.frameNo++;

			submarino.speedX = 0;
            submarino.speedY = 0;
            if (myGameArea.key && myGameArea.key == 40){ movedown(); }
            if (myGameArea.key && myGameArea.key == 39){ moveright(); }
            if (myGameArea.key && myGameArea.key == 37){ moveleft(); }
            if (myGameArea.key && myGameArea.key == 38){ moveup(); }

            if(myGameArea.frameNo == 1 || myGameArea.frameNo % 450 == 0){
                var loop = Math.floor(Math.random() * 4 + 1);
                for(i=loop;i>=0;i--){
                    var rand = Math.floor(Math.random() * 5);
                    var rand2 = Math.round(Math.random());
                    var rand3 = Math.round(Math.random()) + 1;
                    if(i == 2) {
                        var mergulhador = new Component(124, 40, "app/assets/img/mergulhador.png",rand2 == 1 ? 800 : -102, (rand * 80) + 10,'M',rand2 == 1);
                        mergulhador.speedX = rand2 == 1 ? -rand3 : rand3;
                        obstacles.push(mergulhador);
                    }else{
                        var tubarao = new Component(102, 40, "app/assets/img/tubarao.png",rand2 == 1 ? 800 : -102, (rand * 80) + 10,'T',rand2 == 1);
                        tubarao.speedX = rand2 == 1 ? -rand3 : rand3;
                        obstacles.push(tubarao);
                    }
                }

            }

            for (var i = 0; i < obstacles.length; i += 1) {
                if (submarino.crashWith(obstacles[i])) {
                    if(obstacles[i].type == 'M'){
                        $scope.$apply(function(){
                            $scope.resgatados++;
                            $scope.score += 10;
                        });
                        obstacles.splice(i, 1);
                    }else{
                        myGameArea.stop();
                        return;
                    }
                }
            }

            for (i=0;i < obstacles.length; i+=1)
                obstacles[i].update();

            submarino.update();
        }

        function drawImage(img, x, y, flip) {
            var context = myGameArea.context;
            context.save();
            var width = img.width;
            var height = img.height;
            context.translate(x + width/2, y + height/2);
            context.scale(flip ? -1 : 1, 1);
            context.drawImage(img, -width/2, -height/2, width, height);
            context.restore();
        }


        function moveup() {
            submarino.speedY -= 3;
        }

        function movedown() {
            submarino.speedY += 3;
        }

        function moveleft() {
            submarino.speedX -= 3;
            submarino.flip = true;
        }

        function moveright() {
            submarino.speedX += 3;
            submarino.flip = false;
        }

        function stopMove() {
            submarino.speedX = 0;
            submarino.speedY = 0;
        }

    });

}());
