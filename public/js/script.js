/*
	PHOTOSPHERE with THREEE.js code
*/

var container 	= document.getElementById('container');

var width 		= window.innerWidth,
	height 		= window.innerHeight;

var renderer = Detector.webgl ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();	// use if webgl if present or fallback to canvas
	renderer.setSize(width,height);

/* CONSTANTS */
var PI 		= Math.PI,
	Camera 	= {
		FOV 	: 75,
		ASPECT 	: width/height,
		NEAR 	: 1,
		FAR 	: 1000 
	},
	Sphere 	= {
		RADIUS 	  : 150,
		HSEGMENTS : 20,
		VSEGMENTS : 20
	}

/*
 Creation of a scene, a camera and a sphere .
*/

var scene 		= new THREE.Scene(),
	camera	 	= new THREE.PerspectiveCamera(Camera.FOV, Camera.ASPECT, Camera.NEAR, Camera.FAR);

var geometry    = new THREE.SphereGeometry(Sphere.RADIUS,Sphere.HSEGMENTS,Sphere.VSEGMENTS),
	material 	= new THREE.MeshBasicMaterial(
						{
							map : THREE.ImageUtils.loadTexture('img.jpg'),
							overdraw : true // To the make the division lines of geometry disappear 
						}
				 	),
	sphere 		= new THREE.Mesh(geometry,material); 

/* Positioning and other transforms */

sphere.scale.x = -1 // Invert the sphere to get the picture inside of sphere because our camera will be inside

camera.position.x = 0.1; //TODO with lookAt and stuff

scene.add(sphere);

/*Controls*/
var controls = new THREE.OrbitControls(camera,renderer.domElement);
	controls.noPan = true;
	controls.noZoom = true;
	controls.autoRotate = true;
	controls.autoRotateSpeed = 0.5; //TODO

/*Rendering*/
container.appendChild(renderer.domElement);
render();

function render() {
	controls.update();
	requestAnimationFrame(render);
	renderer.render(scene,camera);

}

/* Events when scrolling, and on window resize*/
function onMouseWheel(event){
	event.preventDefault();

	if(event.wheelDeltaY) {
		//Webkit
		camera.fov -= event.wheelDeltaY * 0.05;

	}
	else if(event.wheelDelta) {
		camera.fov -= event.wheelDelta * 0.05;
	}
	else if(event.detail) {
		camera.fov += event.detail * 1.0;
	}

	camera.fov = Math.max(50, Math.min(90, camera.fov));
	camera.updateProjectionMatrix();
}

container.addEventListener('mousewheel',onMouseWheel,false);
container.addEventListener('DOMMouseScroll',onMouseWheel,false);


function onResized(event) {
	renderer.setSize(window.innerWidth,window.innerHeight);
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
	render();
}

window.addEventListener('resize',onResized,false);

function onCameraReset(){
	document.querySelector('.zoom-range-value.default').classList.remove('default');
	document.querySelector('[data-zoom="75"]').classList.add('default');
	camera.fov = 75;
	camera.updateProjectionMatrix();
}


var resetButton = document.getElementById('reset-button');
	resetButton.addEventListener('click',onCameraReset);

/*Arrow controls*/
var arrows = document.getElementById('controls');
	arrows.addEventListener('click',moveOnClick,false);

function moveOnClick(e){
	var button = e.target;
		switch(button.dataset.movement) {
			case "up" 	: 	
					    rotate("y",-PI/20)
					    break;
			case "down" :
						rotate("y",PI/20);
						break;
			case "left"	: 
						rotate("x",-PI/20);
						break;
			case "right":	
						rotate("x",PI/20);
						break;
			default : break;
		}
}

function rotate(plane,radians) {
	if(plane === "x") controls.rotateLeft(radians);
	else controls.rotateUp(radians);
}

/* Zoom Controls */

var zoomPlus 	= document.getElementById('zoom-plus'),
	zoomMinus 	= document.getElementById('zoom-minus');

function zoom(increase){
	var current = camera.fov;
	var ranges = [].slice.call(document.querySelectorAll('.zoom-range-value'));

	if(increase) {
		for(var i=0; i< ranges.length; ++i) {

			var newFOV = parseInt(ranges[i].getAttribute('data-zoom'));

			if(newFOV < current) {
				document.querySelector('.zoom-range-value.default').classList.remove('default');
				ranges[i].classList.add('default');
				camera.fov = newFOV;
				break;
			}

		}
	}
	else {
		for(var i=ranges.length-1; i >= 0; --i) {

			var newFOV = parseInt(ranges[i].getAttribute('data-zoom'));

			if(newFOV > current) {
				document.querySelector('.zoom-range-value.default').classList.remove('default');
				ranges[i].classList.add('default');
				camera.fov = newFOV;
				break;
			}

		}

	}

	camera.updateProjectionMatrix();
}

zoomPlus.addEventListener('click',function(){ zoom(true)});
zoomMinus.addEventListener('click',function(){ zoom(false)});


/* Stop/Start Auto roate*/

function toggleAutoRotate(){
	controls.autoRotate = !controls.autoRotate;
	controls.update();
}

var checkbox = document.getElementById('auto-rotate');
	checkbox.addEventListener('change',toggleAutoRotate);


