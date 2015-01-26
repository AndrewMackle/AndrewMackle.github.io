/// <reference path="libs/dat.gui.min.js" />
/// <reference path="libs/stats.min.js" />
/// <reference path="libs/three.min.js" />

//author: Andrew Mackle
//filename: rubik.js

//declare global variables
var scene, camera, renderer;
var stats, controls;

var masterCube,holder, holder2, side;
var size = 5;
var isTurningLeft = false;
var isTurningRight = false;
var isTurningUp = false;
var isTurningDown = false;
var isRotatingTopClockwise = false;
var isRotatingTopCounterClockwise = false;
var isRotatingLeftClockwise = false;
var isRotatingLeftCounterClockwise = false;
var isRotatingRightClockwise = false;
var isRotatingRightCounterClockwise = false;
var isRotateCenterRowClockwise = false;
var isRotateCenterRowCounterClockwise = false;
var isRotateCenterLeftColumnClockwise = false;
var isRotateCenterLeftColumnCounterClockwise = false;
var isRotateCenterRightColumnClockwise = false;
var isRotateCenterRightColumnCounterClockwise = false;
var isInMotion = false;
var turningCount = 0;
var turningCountMax = 10;
var speed = 20;
var i = 0;
var cubes = [];
var seperation = 0;
var sprite = THREE.ImageUtils.loadTexture('assets/square.png');

function init() {
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    scene = new THREE.Scene();

    // create a render and set the size
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xeeeeee, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    // add the output of the renderer to the html element
    document.body.appendChild(renderer.domElement);
}

function setupCameraAndLight() {
    // create a camera, which defines where we're looking at.
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // position and point the camera to the center of the scene
    camera.position.x = 90;
    camera.position.y = 60;
    camera.position.z = 90;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

}

function addGeometries() {
    var groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);
    var groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({ color: 0x777777 }));
    groundMesh.rotation.x = -Math.PI / 2;
    scene.add(groundMesh);

    masterCube = new THREE.Object3D();
    side = new THREE.Object3D();
    holder = new THREE.Object3D();
    holder.position.y = (size + seperation) * 3 / 2;
    holder2 = new THREE.Object3D();

    var cubeGeom = new THREE.CubeGeometry(size, size, size);
    var mats = [];
    mats.push(new THREE.MeshBasicMaterial({ color: 0x009e60, map: sprite }));
    mats.push(new THREE.MeshBasicMaterial({ color: 0x0051ba, map: sprite }));
    mats.push(new THREE.MeshBasicMaterial({ color: 0xffd500, map: sprite }));
    mats.push(new THREE.MeshBasicMaterial({ color: 0xff5800, map: sprite }));
    mats.push(new THREE.MeshBasicMaterial({ color: 0xC41E3A, map: sprite }));
    mats.push(new THREE.MeshBasicMaterial({ color: 0xffffff, map: sprite }));
    var faceMaterial = new THREE.MeshFaceMaterial(mats);

    var cube;
    var x = 0;
    var y = 0;
    var z = 0;
    while (z < 3) {
        while (y < 3) {
            while (x < 3) {
                cube = new THREE.Mesh(cubeGeom, faceMaterial);
                cube.position.set((size + seperation) * (x-1),
                    (size + seperation) * (y - 1),
                    (size + seperation) * (z - 1));
                cubes.push(cube);
                masterCube.add(cubes[x + y * 3 + z * 9]);
                x = x + 1;
            }
            x = 0;
            y = y + 1;
        }
        y = 0;
        z = z + 1;
    }
    
    holder.add(masterCube);
    scene.add(holder);
    scene.add(holder2);
}

function initGui() {
    controls = new function () {
        this.turnCubeLeft = function () {
            if (!isInMotion) {
                isTurningLeft = true;
                isInMotion = true;
            }
        }
        this.turnCubeRight = function () {
            if (!isInMotion) {
                isTurningRight = true;
                isInMotion = true;
            }
        }
        this.turnCubeUp = function () {
            if (!isInMotion) {
                isTurningUp = true;
                isInMotion = true;
            }
        }
        this.turnCubeDown = function () {
            if (!isInMotion) {
                isTurningDown = true;
                isInMotion = true;
            }
        }

        this.rotateTopClockwise = function () {
            if (!isInMotion) {
                i = 0;
                while (i < cubes.length) {
                    if (cubeAtTop(i)) {
                        side.add(cubes[i]);
                        masterCube.remove(cubes[i]);
                    }
                    i += 1;
                }
                holder2.position.y = (size + seperation) * 3 / 2;
                holder2.add(side);
                isRotatingTopClockwise = true;
                isInMotion = true;
            }
        }
        this.rotateTopCounterClockwise = function () {
            if (!isInMotion) {
                i = 0;
                while (i < cubes.length) {
                    if (cubeAtTop(i)) {
                        side.add(cubes[i]);
                        masterCube.remove(cubes[i]);
                    }
                    i += 1;
                }
                holder2.position.y = (size + seperation) * 3 / 2;
                holder2.add(side);
                isRotatingTopCounterClockwise = true;
                isInMotion = true;
            }
        }
        this.rotateLeftClockwise = function () {
            if (!isInMotion) {
                i = 0;
                while (i < cubes.length) {
                    if (cubeAtLeft(i)) {
                        side.add(cubes[i]);
                        masterCube.remove(cubes[i]);
                    }
                    i += 1;
                }
                holder2.position.y = (size + seperation) * 3 / 2;
                holder2.add(side);
                isRotatingLeftClockwise = true;
                isInMotion = true;
            }
        }
        this.rotateLeftCounterClockwise = function () {
            if (!isInMotion) {
                i = 0;
                while (i < cubes.length) {
                    if (cubeAtLeft(i)) {
                        side.add(cubes[i]);
                        masterCube.remove(cubes[i]);
                    }
                    i += 1;
                }
                holder2.position.y = (size + seperation) * 3 / 2;
                holder2.add(side);
                isRotatingLeftCounterClockwise = true;
                isInMotion = true;
            }
        }
        this.rotateRightClockwise = function () {
            if (!isInMotion) {
                i = 0;
                while (i < cubes.length) {
                    if (cubeAtRight(i)) {
                        side.add(cubes[i]);
                        masterCube.remove(cubes[i]);
                    }
                    i += 1;
                }
                holder2.position.y = (size + seperation) * 3 / 2;
                holder2.add(side);
                isRotatingRightClockwise = true;
                isInMotion = true;
            }
        }
        this.rotateRightCounterClockwise = function () {
            if (!isInMotion) {
                i = 0;
                while (i < cubes.length) {
                    if (cubeAtRight(i)) {
                        side.add(cubes[i]);
                        masterCube.remove(cubes[i]);
                    }
                    i += 1;
                }
                holder2.position.y = (size + seperation) * 3 / 2;
                holder2.add(side);
                isRotatingRightCounterClockwise = true;
                isInMotion = true;
            }
        }
        this.rotateCenterRowClockwise = function () {
            if (!isInMotion) {
                i = 0;
                while (i < cubes.length) {
                    if (!cubeAtTop(i) && !cubeAtBotom(i)) {
                        side.add(cubes[i]);
                        masterCube.remove(cubes[i]);
                    }
                    i += 1;
                }
                holder2.position.y = (size + seperation) * 3 / 2;
                holder2.add(side);
                isRotateCenterRowClockwise = true;
                isInMotion = true;
            }
        }
        this.rotateCenterRowCounterClockwise = function () {
            if (!isInMotion) {
                i = 0;
                while (i < cubes.length) {
                    if (!cubeAtTop(i) && !cubeAtBotom(i)) {
                        side.add(cubes[i]);
                        masterCube.remove(cubes[i]);
                    }
                    i += 1;
                }
                holder2.position.y = (size + seperation) * 3 / 2;
                holder2.add(side);
                isRotateCenterRowCounterClockwise = true;
                isInMotion = true;
            }
        }
        this.rotateCenterLeftColumnClockwise = function () {
            if (!isInMotion) {
                i = 0;
                while (i < cubes.length) {
                    if (!cubeAtRight(i) && !cubeAtFarRight(i)) {
                        side.add(cubes[i]);
                        masterCube.remove(cubes[i]);
                    }
                    i += 1;
                }
                holder2.position.y = (size + seperation) * 3 / 2;
                holder2.add(side);
                isRotateCenterLeftColumnClockwise = true;
                isInMotion = true;
            }
        }
        this.rotateCenterLeftColumnCounterClockwise = function () {
            if (!isInMotion) {
                i = 0;
                while (i < cubes.length) {
                    if (!cubeAtRight(i) && !cubeAtFarRight(i)) {
                        side.add(cubes[i]);
                        masterCube.remove(cubes[i]);
                    }
                    i += 1;
                }
                holder2.position.y = (size + seperation) * 3 / 2;
                holder2.add(side);
                isRotateCenterLeftColumnCounterClockwise = true;
                isInMotion = true;
            }
        }
        this.rotateCenterRightColumnClockwise = function () {
            if (!isInMotion) {
                i = 0;
                while (i < cubes.length) {
                    if (!cubeAtLeft(i) && !cubeAtFarLeft(i)) {
                        side.add(cubes[i]);
                        masterCube.remove(cubes[i]);
                    }
                    i += 1;
                }
                holder2.position.y = (size + seperation) * 3 / 2;
                holder2.add(side);
                isRotateCenterRightColumnClockwise = true;
                isInMotion = true;
            }
        }
        this.rotateCenterRightColumnCounterClockwise = function () {
            if (!isInMotion) {
                i = 0;
                while (i < cubes.length) {
                    if (!cubeAtLeft(i) && !cubeAtFarLeft(i)) {
                        side.add(cubes[i]);
                        masterCube.remove(cubes[i]);
                    }
                    i += 1;
                }
                holder2.position.y = (size + seperation) * 3 / 2;
                holder2.add(side);
                isRotateCenterRightColumnCounterClockwise = true;
                isInMotion = true;
            }
        }
    }

    var gui = new dat.GUI();
    gui.add(controls, 'turnCubeLeft');
    gui.add(controls, 'turnCubeRight');
    gui.add(controls, 'turnCubeUp');
    gui.add(controls, 'turnCubeDown');
    var rotateTopFolder = gui.addFolder('rotateTop');
    rotateTopFolder.add(controls, 'rotateTopClockwise').name('clockwise');
    rotateTopFolder.add(controls, 'rotateTopCounterClockwise').name('counterClockwise');
    var rotateLeftFolder = gui.addFolder('rotateLeft');
    rotateLeftFolder.add(controls, 'rotateLeftClockwise').name('clockwise');
    rotateLeftFolder.add(controls, 'rotateLeftCounterClockwise').name('counterClockwise');
    var rotateRightFolder = gui.addFolder('rotateRight');
    rotateRightFolder.add(controls, 'rotateRightClockwise').name('clockwise');
    rotateRightFolder.add(controls, 'rotateRightCounterClockwise').name('counterClockwise');
    var rotateCenterRowFolder = gui.addFolder('rotateCenterRow');
    rotateCenterRowFolder.add(controls, 'rotateCenterRowClockwise').name('clockwise');
    rotateCenterRowFolder.add(controls, 'rotateCenterRowCounterClockwise').name('counterClockwise');
    var rotateCenterLeftColumnFolder = gui.addFolder('rotateCenterLeftColumn');
    rotateCenterLeftColumnFolder.add(controls, 'rotateCenterLeftColumnClockwise').name('clockwise');
    rotateCenterLeftColumnFolder.add(controls, 'rotateCenterLeftColumnCounterClockwise').name('counterClockwise');
    var rotateCenterRightColumnFolder = gui.addFolder('rotateCenterRightColumn');
    rotateCenterRightColumnFolder.add(controls, 'rotateCenterRightColumnClockwise').name('clockwise');
    rotateCenterRightColumnFolder.add(controls, 'rotateCenterRightColumnCounterClockwise').name('counterClockwise');
}

function cubeAtTop(i) {
    var j = 0;
    while(j < cubes.length){
        if (cubes[i].position.y >= cubes[j].position.y) {

        }
        else {
            return false;
        }
        j += 1;
    }
    return true;
}

function cubeAtBotom(i) {
    var j = 0;
    while (j < cubes.length) {
        if (cubes[i].position.y <= cubes[j].position.y) {

        }
        else {
            return false;
        }
        j += 1;
    }
    return true;
}

function cubeAtLeft(i) {
    var j = 0;
    while (j < cubes.length) {
        if (cubes[i].position.z >= cubes[j].position.z) {

        }
        else {
            return false;
        }
        j += 1;
    }
    return true;
}

function cubeAtFarLeft(i) {
    var j = 0;
    while (j < cubes.length) {
        if (cubes[i].position.z <= cubes[j].position.z) {

        }
        else {
            return false;
        }
        j += 1;
    }
    return true;
}

function cubeAtRight(i) {
    var j = 0;
    while (j < cubes.length) {
        if (cubes[i].position.x >= cubes[j].position.x) {

        }
        else {
            return false;
        }
        j += 1;
    }
    return true;
}

function cubeAtFarRight(i) {
    var j = 0;
    while (j < cubes.length) {
        if (cubes[i].position.x <= cubes[j].position.x) {

        }
        else {
            return false;
        }
        j += 1;
    }
    return true;
}

function checkTurning() {
    if (isTurningLeft) {
        if (turningCount < turningCountMax) {
            holder.rotateY(0 - Math.PI / speed);
            turningCount += 1;
        }
        else {
            i = 0;
            while (i < 27) {
                cubes[i].applyMatrix(holder.matrixWorld);
                cubes[i].position.y -= (size + seperation) * 3 / 2;

                i += 1;
            }
            holder.remove(masterCube);
            holder.rotateY(Math.PI / 2);
            holder.add(masterCube);
            isTurningLeft = false;
            isInMotion = false;
            turningCount = 0;
        }
    }
    if (isTurningRight) {
        if (turningCount < turningCountMax) {
            holder.rotateY(Math.PI / speed);
            turningCount += 1;
        }
        else {
            i = 0;
            while (i < 27) {
                cubes[i].applyMatrix(holder.matrixWorld);
                cubes[i].position.y -= (size + seperation) * 3 / 2;

                i += 1;
            }
            holder.remove(masterCube);
            holder.rotateY(0 - Math.PI / 2);
            holder.add(masterCube);
            isTurningRight = false;
            isInMotion = false;
            turningCount = 0;
        }
    }
    if (isTurningUp) {
        if (turningCount < turningCountMax) {
            holder.rotateX(0 - Math.PI / speed);
            turningCount += 1;
        }
        else {
            i = 0;
            while (i < 27) {
                cubes[i].applyMatrix(holder.matrixWorld);
                cubes[i].position.y -= (size + seperation) * 3 / 2;

                i += 1;
            }
            holder.remove(masterCube);
            holder.rotateX(Math.PI / 2);
            holder.add(masterCube);
            isTurningUp = false;
            isInMotion = false;
            turningCount = 0;
        }
    }
    if (isTurningDown) {
        if (turningCount < turningCountMax) {
            holder.rotateX(Math.PI / speed);
            turningCount += 1;
        }
        else {
            i = 0;
            while (i < 27) {
                cubes[i].applyMatrix(holder.matrixWorld);
                cubes[i].position.y -= (size + seperation) * 3 / 2;
                
                i += 1;
            }
            holder.remove(masterCube);
            holder.rotateX(0 - Math.PI / 2);
            holder.add(masterCube);
            isTurningDown = false;
            isInMotion = false;
            turningCount = 0;
        }
    }
}

function checkRotation() {
    if (isRotatingTopClockwise) {
        if (turningCount < turningCountMax) {
            holder2.rotateY(0-Math.PI / speed);
            turningCount += 1;
        }
        else {
            holder2.position.y = 0;
            i = side.children.length - 1;
            while (i >= 0) {
                cubes[cubes.indexOf(side.children[i])].applyMatrix(holder2.matrixWorld);
                cubes[cubes.indexOf(side.children[i])].position.y -= (size * 3 / 2);
                masterCube.add(cubes[cubes.indexOf(side.children[i])]);
                side.remove(cubes[cubes.indexOf(side.children[i])]);
                i -= 1;
            }
            holder2.remove(side);
            holder2.rotateY(Math.PI / 2);
            isRotatingTopClockwise = false;
            isInMotion = false;
            turningCount = 0;
        }
    }
    if (isRotatingTopCounterClockwise) {
        if (turningCount < turningCountMax) {
            holder2.rotateY(Math.PI / speed);
            turningCount += 1;
        }
        else {
            holder2.position.y = 0;
            i = side.children.length - 1;
            while (i >= 0) {
                cubes[cubes.indexOf(side.children[i])].applyMatrix(holder2.matrixWorld);
                cubes[cubes.indexOf(side.children[i])].position.y -= (size * 3 / 2);
                masterCube.add(cubes[cubes.indexOf(side.children[i])]);
                side.remove(cubes[cubes.indexOf(side.children[i])]);
                i -= 1;
            }
            holder2.remove(side);
            holder2.rotateY(0 - Math.PI / 2);
            isRotatingTopCounterClockwise = false;
            isInMotion = false;
            turningCount = 0;
        }
    }
    if (isRotatingLeftClockwise) {
        if (turningCount < turningCountMax) {
            holder2.rotateZ(0- Math.PI / speed);
            turningCount += 1;
        }
        else {
            holder2.position.y = 0;
            i = side.children.length - 1;
            while (i >= 0) {
                cubes[cubes.indexOf(side.children[i])].applyMatrix(holder2.matrixWorld);
                cubes[cubes.indexOf(side.children[i])].position.y -= (size * 3/2);
                masterCube.add(cubes[cubes.indexOf(side.children[i])]);
                side.remove(cubes[cubes.indexOf(side.children[i])]);
                i -= 1;
            }
            holder2.remove(side);
            holder2.rotateZ(Math.PI / 2);
            isRotatingLeftClockwise = false;
            isInMotion = false;
            turningCount = 0;
        }
    }
    if (isRotatingLeftCounterClockwise) {
        if (turningCount < turningCountMax) {
            holder2.rotateZ(Math.PI / speed);
            turningCount += 1;
        }
        else {
            holder2.position.y = 0;
            i = side.children.length - 1;
            while (i >= 0) {
                cubes[cubes.indexOf(side.children[i])].applyMatrix(holder2.matrixWorld);
                cubes[cubes.indexOf(side.children[i])].position.y -= (size * 3 / 2);
                masterCube.add(cubes[cubes.indexOf(side.children[i])]);
                side.remove(cubes[cubes.indexOf(side.children[i])]);
                i -= 1;
            }
            holder2.remove(side);
            holder2.rotateZ(0 - Math.PI / 2);
            isRotatingLeftCounterClockwise = false;
            isInMotion = false;
            turningCount = 0;
        }
    }
    if (isRotatingRightClockwise) {
        if (turningCount < turningCountMax) {
            holder2.rotateX(0 - Math.PI / speed);
            turningCount += 1;
        }
        else {
            holder2.position.y = 0;
            i = side.children.length - 1;
            while (i >= 0) {
                cubes[cubes.indexOf(side.children[i])].applyMatrix(holder2.matrixWorld);
                cubes[cubes.indexOf(side.children[i])].position.y -= (size * 3 / 2);
                masterCube.add(cubes[cubes.indexOf(side.children[i])]);
                side.remove(cubes[cubes.indexOf(side.children[i])]);
                i -= 1;
            }
            holder2.remove(side);
            holder2.rotateX(Math.PI / 2);
            isRotatingRightClockwise = false;
            isInMotion = false;
            turningCount = 0;
        }
    }
    if (isRotatingRightCounterClockwise) {
        if (turningCount < turningCountMax) {
            holder2.rotateX(Math.PI / speed);
            turningCount += 1;
        }
        else {
            holder2.position.y = 0;
            i = side.children.length - 1;
            while (i >= 0) {
                cubes[cubes.indexOf(side.children[i])].applyMatrix(holder2.matrixWorld);
                cubes[cubes.indexOf(side.children[i])].position.y -= (size * 3 / 2);
                masterCube.add(cubes[cubes.indexOf(side.children[i])]);
                side.remove(cubes[cubes.indexOf(side.children[i])]);
                i -= 1;
            }
            holder2.remove(side);
            holder2.rotateX(0 - Math.PI / 2);
            isRotatingRightCounterClockwise = false;
            isInMotion = false;
            turningCount = 0;
        }
    }
    if (isRotateCenterRowClockwise) {
        if (turningCount < turningCountMax) {
            holder2.rotateY(0 - Math.PI / speed);
            turningCount += 1;
        }
        else {
            holder2.position.y = 0;
            i = side.children.length - 1;
            while (i >= 0) {
                cubes[cubes.indexOf(side.children[i])].applyMatrix(holder2.matrixWorld);
                cubes[cubes.indexOf(side.children[i])].position.y -= (size * 3 / 2);
                masterCube.add(cubes[cubes.indexOf(side.children[i])]);
                side.remove(cubes[cubes.indexOf(side.children[i])]);
                i -= 1;
            }
            holder2.remove(side);
            holder2.rotateY(Math.PI / 2);
            isRotateCenterRowClockwise = false;
            isInMotion = false;
            turningCount = 0;
        }
    }
    if (isRotateCenterRowCounterClockwise) {
        if (turningCount < turningCountMax) {
            holder2.rotateY(Math.PI / speed);
            turningCount += 1;
        }
        else {
            holder2.position.y = 0;
            i = side.children.length - 1;
            while (i >= 0) {
                cubes[cubes.indexOf(side.children[i])].applyMatrix(holder2.matrixWorld);
                cubes[cubes.indexOf(side.children[i])].position.y -= (size * 3 / 2);
                masterCube.add(cubes[cubes.indexOf(side.children[i])]);
                side.remove(cubes[cubes.indexOf(side.children[i])]);
                i -= 1;
            }
            holder2.remove(side);
            holder2.rotateY(0 - Math.PI / 2);
            isRotateCenterRowCounterClockwise = false;
            isInMotion = false;
            turningCount = 0;
        }
    }
    if (isRotateCenterLeftColumnClockwise) {
        if (turningCount < turningCountMax) {
            holder2.rotateX(0 - Math.PI / speed);
            turningCount += 1;
        }
        else {
            holder2.position.y = 0;
            i = side.children.length - 1;
            while (i >= 0) {
                cubes[cubes.indexOf(side.children[i])].applyMatrix(holder2.matrixWorld);
                cubes[cubes.indexOf(side.children[i])].position.y -= (size * 3 / 2);
                masterCube.add(cubes[cubes.indexOf(side.children[i])]);
                side.remove(cubes[cubes.indexOf(side.children[i])]);
                i -= 1;
            }
            holder2.remove(side);
            holder2.rotateX(Math.PI / 2);
            isRotateCenterLeftColumnClockwise = false;
            isInMotion = false;
            turningCount = 0;
        }
    }
    if (isRotateCenterLeftColumnCounterClockwise) {
        if (turningCount < turningCountMax) {
            holder2.rotateX(Math.PI / speed);
            turningCount += 1;
        }
        else {
            holder2.position.y = 0;
            i = side.children.length - 1;
            while (i >= 0) {
                cubes[cubes.indexOf(side.children[i])].applyMatrix(holder2.matrixWorld);
                cubes[cubes.indexOf(side.children[i])].position.y -= (size * 3 / 2);
                masterCube.add(cubes[cubes.indexOf(side.children[i])]);
                side.remove(cubes[cubes.indexOf(side.children[i])]);
                i -= 1;
            }
            holder2.remove(side);
            holder2.rotateX(0 - Math.PI / 2);
            isRotateCenterLeftColumnCounterClockwise = false;
            isInMotion = false;
            turningCount = 0;
        }
    }
    if (isRotateCenterRightColumnClockwise) {
        if (turningCount < turningCountMax) {
            holder2.rotateZ(0 - Math.PI / speed);
            turningCount += 1;
        }
        else {
            holder2.position.y = 0;
            i = side.children.length - 1;
            while (i >= 0) {
                cubes[cubes.indexOf(side.children[i])].applyMatrix(holder2.matrixWorld);
                cubes[cubes.indexOf(side.children[i])].position.y -= (size * 3 / 2);
                masterCube.add(cubes[cubes.indexOf(side.children[i])]);
                side.remove(cubes[cubes.indexOf(side.children[i])]);
                i -= 1;
            }
            holder2.remove(side);
            holder2.rotateZ(Math.PI / 2);
            isRotateCenterRightColumnClockwise = false;
            isInMotion = false;
            turningCount = 0;
        }
    }
    if (isRotateCenterRightColumnCounterClockwise) {
        if (turningCount < turningCountMax) {
            holder2.rotateZ(Math.PI / speed);
            turningCount += 1;
        }
        else {
            holder2.position.y = 0;
            i = side.children.length - 1;
            while (i >= 0) {
                cubes[cubes.indexOf(side.children[i])].applyMatrix(holder2.matrixWorld);
                cubes[cubes.indexOf(side.children[i])].position.y -= (size * 3 / 2);
                masterCube.add(cubes[cubes.indexOf(side.children[i])]);
                side.remove(cubes[cubes.indexOf(side.children[i])]);
                i -= 1;
            }
            holder2.remove(side);
            holder2.rotateZ(0 - Math.PI / 2);
            isRotateCenterRightColumnCounterClockwise = false;
            isInMotion = false;
            turningCount = 0;
        }
    }
}

function animate() {
    stats.update();

    checkTurning();
    checkRotation();

    // render using requestAnimationFrame
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function initStats() {
    stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms
    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
}

window.onload = function () {
    init();
    addGeometries();
    setupCameraAndLight();
    initStats();
    initGui();
    animate();
};