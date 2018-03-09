// ...........................................PAGE LOADER.....................................................
$(window).on('load', function () {
  $('#loader').animate({width: '40%'}, 1000, function () {
    $('#loader').animate({width: '100%'}, 1500, function () {
      $('#loader').fadeOut('fast')
      $('#load-top').animate({
        top: '-=800'
      }, 900)
      $('#load-bottom').animate({
        top: '+=500'
      }, 900)
      $('#load_screen').delay(1700).fadeOut('fast')
    })
  })
})

// ...............................................THREE.JS.....................................................
// COLORS
var Colors = {
  // red:0xf25346,
  // white:0xd8d0d1,
  // brown:0x59332e,
  // pink:0xF5986E,
  // brownDark:0x23190f,
  // blue:0x68c3c0,
  red: 0x753742,
  white: 0xE0FBFC,
  brown: 0xD5896F,
  pink: 0xF5986E,
  brownDark: 0x4F3130,
  blue: 0x5BC0EB,
  blueDark: 0x224973,
  green: 0x70A288,
  pastel: 0xA9BCD0
}

// THREEJS RELATED VARIABLES

var scene,
  camera, fieldOfView, aspectRatio, nearPlane, farPlane,
  renderer, container

//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH,
  mousePos = { x: 0, y: 0 }

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function createScene() {

HEIGHT = window.innerHeight;
WIDTH = window.innerWidth;

scene = new THREE.Scene();
aspectRatio = WIDTH / HEIGHT;
fieldOfView = 60;
nearPlane = 1;
farPlane = 10000;
camera = new THREE.PerspectiveCamera(
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane
  );
scene.fog = new THREE.Fog(0x224973, 100, 950);
camera.position.x = 0;
camera.position.z = 200;
camera.position.y = 100;

renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.shadowMap.enabled = true;
container = document.getElementById('world');
container.appendChild(renderer.domElement);

window.addEventListener('resize', handleWindowResize, false);
}

// HANDLE SCREEN EVENTS

function handleWindowResize() {
HEIGHT = window.innerHeight;
WIDTH = window.innerWidth;
renderer.setSize(WIDTH, HEIGHT);
camera.aspect = WIDTH / HEIGHT;
camera.updateProjectionMatrix();
}


// LIGHTS

var ambientLight, hemisphereLight, shadowLight;

function createLights() {

hemisphereLight = new THREE.HemisphereLight(0x000000, 0xaaaaaa, .9)
shadowLight = new THREE.DirectionalLight(0xffffff, .9);
shadowLight.position.set(150, 350, 350);
shadowLight.castShadow = true;
shadowLight.shadow.camera.left = -400;
shadowLight.shadow.camera.right = 400;
shadowLight.shadow.camera.top = 400;
shadowLight.shadow.camera.bottom = -400;
shadowLight.shadow.camera.near = 1;
shadowLight.shadow.camera.far = 1000;
shadowLight.shadow.mapSize.width = 2048;
shadowLight.shadow.mapSize.height = 2048;

scene.add(hemisphereLight);
scene.add(shadowLight);
}


var AirPlane = function(){
this.mesh = new THREE.Object3D();
this.mesh.name = "airPlane";

// Create the cabin
var geomCockpit = new THREE.BoxGeometry(60,50,50,1,1,1);
var matCockpit = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
cockpit.castShadow = true;
cockpit.receiveShadow = true;
this.mesh.add(cockpit);

// Create Engine
var geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
var matEngine = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
var engine = new THREE.Mesh(geomEngine, matEngine);
engine.position.x = 40;
engine.castShadow = true;
engine.receiveShadow = true;
this.mesh.add(engine);

// Create Tailplane

var geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1);
var matTailPlane = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
tailPlane.position.set(-35,25,0);
tailPlane.castShadow = true;
tailPlane.receiveShadow = true;
this.mesh.add(tailPlane);

// Create Wing

var geomSideWing = new THREE.BoxGeometry(40,8,150,1,1,1);
var matSideWing = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
sideWing.position.set(0,0,0);
sideWing.castShadow = true;
sideWing.receiveShadow = true;
this.mesh.add(sideWing);

// Propeller

var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
var matPropeller = new THREE.MeshPhongMaterial({color: Colors.brown, shading:THREE.FlatShading});
this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
this.propeller.castShadow = true;
this.propeller.receiveShadow = true;

// Blades

var geomBlade = new THREE.BoxGeometry(1,100,20,1,1,1);
var matBlade = new THREE.MeshPhongMaterial({color: Colors.brownDark, shading:THREE.FlatShading});

var blade = new THREE.Mesh(geomBlade, matBlade);
blade.position.set(8,0,0);
blade.castShadow = true;
blade.receiveShadow = true;
this.propeller.add(blade);
this.propeller.position.set(50,0,0);
this.mesh.add(this.propeller);
};

Sky = function(){
this.mesh = new THREE.Object3D();
this.nClouds = 20;
this.clouds = [];
var stepAngle = Math.PI*2 / this.nClouds;
for(var i=0; i<this.nClouds; i++){
  var c = new Cloud();
  this.clouds.push(c);
  var a = stepAngle*i;
  var h = 750 + Math.random()*200;
  c.mesh.position.y = Math.sin(a)*h;
  c.mesh.position.x = Math.cos(a)*h;
  c.mesh.position.z = -400-Math.random()*400;
  c.mesh.rotation.z = a + Math.PI/2;
  var s = 1+Math.random()*2;
  c.mesh.scale.set(s,s,s);
  this.mesh.add(c.mesh);
}
}

Sea = function(){
var geom = new THREE.CylinderGeometry(600,600,800,40,10);
geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
var mat = new THREE.MeshPhongMaterial({
  color:Colors.blueDark,
  transparent: false,
  opacity: .1,
  shading:THREE.FlatShading,
});
this.mesh = new THREE.Mesh(geom, mat);
this.mesh.receiveShadow = true;
}

Cloud = function(){
this.mesh = new THREE.Object3D();
this.mesh.name = "cloud";
var geom = new THREE.CubeGeometry(20,20,20);
var mat = new THREE.MeshPhongMaterial({
  color:Colors.white,
});

var nBlocs = 3+Math.floor(Math.random()*3);
for (var i=0; i<nBlocs; i++ ){
  var m = new THREE.Mesh(geom.clone(), mat);
  m.position.x = i*15;
  m.position.y = Math.random()*10;
  m.position.z = Math.random()*10;
  m.rotation.z = Math.random()*Math.PI*2;
  m.rotation.y = Math.random()*Math.PI*2;
  var s = .1 + Math.random()*.9;
  m.scale.set(s,s,s);
  m.castShadow = true;
  m.receiveShadow = true;
  this.mesh.add(m);
}
}

// 3D Models

// // Load the JSON file and provide callback functions (modelToScene
// var loader = new THREE.SceneLoader();
// loader.load( "../img/pixelspaceship.json", addModelToScene );



// // After loading JSON from our file, we add it to the scene
// function addModelToScene( geometry, materials ) {
//   console.log('byeeeee')
//   var material = new THREE.MeshFaceMaterial(materials);
//   model = new THREE.Mesh( geometry, material );
//   model.scale.set(.5,.5,.5);
//   scene.add( model );
// }

// // Special callback to get a reference to the sphere
// function addSphereToScene( geometry, materials ){
//  var material = new THREE.MeshFaceMaterial(materials);
//  sphereModel = new THREE.Mesh( geometry, material );
//  sphereModel.scale.set(0.5,0.5,0.5);
//  sphereModel.position.y += 0.5;
//  scene.add( sphereModel );
// }

// var loaderObj = new THREE.ObjectLoader();
// var loader = new THREE.XHRLoader();
//             loader.load( '../img/pixelspaceship.json', function ( text ) {
//                 text = "{ \"scene\" : " + text + " }";
//                 var json = JSON.parse( text );
//                 var scene = loaderObj.parse( json.scene );
//             },
//             // Function called when download progresses 
//             function ( xhr ) 
//             { console.log( (xhr.loaded / xhr.total * 100) + '% loaded' ); }, 
//             // Function called when download errors 
//             function ( xhr ) 
//             { console.log( 'An error happened' ); }  );



// var loader = new THREE.JSONLoader();
// loader.load( '../img/pixelspaceship.json', function ( geometry, materials ) {
//     var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
//     scene.add( mesh );
// });

// var that = this;
//   var loader = new THREE.BufferGeometryLoader();
//   loader.load( '../img/pixelspaceship.json', function( data ) {
//     that.handleLoaded(data) } );
//     var geometry = new THREE.Geometry().fromBufferGeometry(geometry);
//     var materials = new THREE.MeshLambertMaterial({color:0xff0000});


    // instantiate a loader
// var loader = new THREE.ObjectLoader();

// // load a resource
// loader.load(
// 	// resource URL
// 	'../img/pixelspaceship.js',

// 	// onLoad callback
// 	function ( geometry ) {
//     var material = new THREE.MeshLambertMaterial( { color: 0xF5F5F5, wireframe: true } );
//     geometry = new THREE.Geometry().fromBufferGeometry(geometry)
//     var object = new THREE.Mesh( geometry, material );
//     let group = new THREE.Object3D();
//     group.add(object);
//     scene.add( group );
// 	},

// 	// onProgress callback
// 	function ( xhr ) {
// 		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
// 	},

// 	// onError callback
// 	function ( err ) {
// 		console.log( 'An error happened' );
// 	}
// );
// let material
// let material2
// //  // prepare loader and load the model
//  var oLoader = new THREE.ObjectLoader();
//  oLoader.load('../img/spaceship.json', function(object, materials) {
 
//     material = new THREE.MeshFaceMaterial(materials);
//     material2 = new THREE.MeshLambertMaterial({ color: 0xa65e00 });
 
//    object.traverse( function(child) {
//      if (child instanceof THREE.Mesh) {
 
//        // apply custom material
//        child.material = material2;
 
//        // enable casting shadows
//        child.castShadow = true;
//        child.receiveShadow = true;
//      }
//    });
 
//    object.position.x = 0;
//    object.position.y = 0;
//    object.position.z = 0;
//    object.scale.set(10, 10, 10);
//    scene.add(object);
//  });

// let spaceship
// var mtlLoader = new THREE.MTLLoader();
// mtlLoader.setBaseUrl( "../img/" );
// mtlLoader.setPath("../img/");
// mtlLoader.load( "spaceship.mtl", function( materials ) {
//   materials.preload();
//   var objectLoader = new THREE.ObjectLoader();
//     objectLoader.load("../img/spaceship.json", function ( spaceship ) {
//       spaceship.scale.set(15, 15, 15);
//       spaceship.position.set(-35,25,0);
//       // obj.position.y = 100
//       scene.add( spaceship );
//     } );
// })

var sea;
var airplane;

function createPlane(){
airplane = new AirPlane();
airplane.mesh.scale.set(.25,.25,.25);
airplane.mesh.position.y = 100;
scene.add(airplane.mesh);
}

function createSea(){
sea = new Sea();
sea.mesh.position.y = -600;
scene.add(sea.mesh);
}

// function createSky(){
// sky = new Sky();
// sky.mesh.position.y = -600;
// scene.add(sky.mesh);
// }

// PARTICLES

// make points  available globally
let points

function createParticals () {
  var material = new THREE.PointsMaterial({
    color: 0xffffcc,
    size: .8
  })

  let geometry = new THREE.Geometry()
  var x, y, z
  for (var i = 0; i < 1000; i++) {
    x = (Math.random() * 800) - 400
    y = (Math.random() * 800) - 400
    z = (Math.random() * 800) - 400
    geometry.vertices.push(new THREE.Vector3(x, y, z))
  }

  points = new THREE.Points(geometry, material)
  points.dynamic = true
  points.sortParticles = true
  scene.add(points)
}

function loop(){
updatePlane();
sea.mesh.rotation.z += .005;
// sky.mesh.rotation.z += .01;
points.rotation.z += .008
renderer.render(scene, camera);
requestAnimationFrame(loop);
}

function updatePlane(){
var targetY = normalize(mousePos.y,-.75,.75,25, 175);
var targetX = normalize(mousePos.x,-.75,.75,-100, 100);
airplane.mesh.position.y = targetY;
airplane.mesh.position.x = targetX;
airplane.propeller.rotation.x += 0.3;
}

// function updatePlane(){
//   var targetY = normalize(mousePos.y,-.75,.75,25, 175);
//   var targetX = normalize(mousePos.x,-.75,.75,-100, 100);
//   material.mesh.position.y = targetY;
//   spaceship.position.x = targetX;
//   // airplane.propeller.rotation.x += 0.3;
// }

function normalize(v,vmin,vmax,tmin, tmax){
var nv = Math.max(Math.min(v,vmax), vmin);
var dv = vmax-vmin;
var pc = (nv-vmin)/dv;
var dt = tmax-tmin;
var tv = tmin + (pc*dt);
return tv;
}

function init(event){
document.addEventListener('mousemove', handleMouseMove, false);
createScene();
createLights();
createPlane();
createSea();
// createSky();
createParticals()
loop();
}

// HANDLE MOUSE EVENTS

var mousePos = { x: 0, y: 0 };

function handleMouseMove(event) {
var tx = -1 + (event.clientX / WIDTH)*2;
var ty = 1 - (event.clientY / HEIGHT)*2;
mousePos = {x:tx, y:ty};
}

window.addEventListener('load', init, false);

// ...........................................CHANGE PAGE ON SCROLL.....................................................
/* See related post at
https://codepen.io/Javarome/post/full-page-sliding
*/
function ScrollHandler(pageId) { 
  var page = document.getElementById(pageId);
  var pageStart = page.offsetTop;
  var pageJump = false;
  var viewStart;
  var duration = 1000;
  var scrolled = document.getElementById('wrapper');

  function scrollToPage() {
    pageJump = true;

    // Calculate how far to scroll
    var startLocation = viewStart;
    var endLocation = pageStart;
    var distance = endLocation - startLocation;

    var runAnimation;
    
    // Set the animation variables to 0/undefined.
    var timeLapsed = 0;
    var percentage, position;

    var easing = function (progress) {
      return progress < 0.5 ? 4 * progress * progress * progress : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1; // acceleration until halfway, then deceleration
    };
    
    function stopAnimationIfRequired(pos) {
      if (pos == endLocation) {
        cancelAnimationFrame(runAnimation);
        setTimeout(function() {
          pageJump = false;
        }, 500);  
      }
    }
    
    var animate = function () {
      timeLapsed += 16;
      percentage = timeLapsed / duration;
      if (percentage > 1) {
        percentage = 1;
        position = endLocation;       
      } else {
        position = startLocation + distance * easing(percentage);
      }
      scrolled.scrollTop = position;
      runAnimation = requestAnimationFrame(animate);
      stopAnimationIfRequired(position);
console.log('position=' + scrolled.scrollTop + '(' + percentage + ')');
    };
    // Loop the animation function
      runAnimation = requestAnimationFrame(animate);
  }
  
  window.addEventListener('wheel', function(event) {
   viewStart = scrolled.scrollTop; 
   if (!pageJump) { 
      var pageHeight = page.scrollHeight;
      var pageStopPortion = pageHeight / 2;
      var viewHeight = window.innerHeight;

      var viewEnd = viewStart + viewHeight;
      var pageStartPart = viewEnd - pageStart;
      var pageEndPart = (pageStart + pageHeight) - viewStart;
     
      var canJumpDown = pageStartPart >= 0; 
      var stopJumpDown = pageStartPart > pageStopPortion; 
      
      var canJumpUp = pageEndPart >= 0; 
      var stopJumpUp = pageEndPart > pageStopPortion; 

      var scrollingForward = event.deltaY > 0;
      if (  ( scrollingForward && canJumpDown && !stopJumpDown) 
         || (!scrollingForward && canJumpUp   && !stopJumpUp)) {
        event.preventDefault();
        scrollToPage();
      } false;//
   } else {
     event.preventDefault();
   }  
  })
}
new ScrollHandler('home'); 
new ScrollHandler('about');
new ScrollHandler('projects');
new ScrollHandler('contact');
// ...........................................SCROLL WHEN DOT CLICKED....................................................
  
$('.dot').click(function(e) {
    let id = $(this).find("a").attr("href")

    $(".dot").removeClass("active")
    e.preventDefault(); //stop regular anchor behavior
    // e.stopPropagation();
    let $target = $(e.target)
    $target.addClass('active')
    $('#wrapper').stop().animate({
        'scrollTop':  $('#wrapper').scrollTop() + $(`${id}`).offset().top //added bc div is inside a div
    }, 700, 'linear', function () {
        window.location.hash = `${id}`;
    })
})
  
// ...........................................CHANGE DOTS ON SCROLL....................................................
// referenced from https://codepen.io/pedrodj46/pen/BKBOaJ

$(document).ready(function () {
    /* Every time the window is scrolled ... */
    $('#wrapper').scroll( function (){

      /* Check the location of each desired element */
      $('.page').each( function (i){
  
        /* If the object is completely visible in the window, do below */
        if( isScrolledIntoView($(this)) ){
          let currentPage = $(this).attr('id')
          $(".dot").removeClass("active")
            if(currentPage === 'home') {
              $("#dot1").addClass("active")
              $("#main-logo").removeClass("active")
              $('#scroll-btn').removeClass('deactivate')
            }else if(currentPage === 'about') {
              $("#dot2").addClass("active")
              $("#main-logo").addClass("active")
            }else if(currentPage === 'projects') {
              $("#dot3").addClass("active")
              $("#main-logo").addClass("active")
            }else {
              $("#dot4").addClass("active")
              $("#main-logo").addClass("active")
              $('#scroll-btn').addClass('deactivate')
            }    
        }
      })
    }) 
  })

  function isScrolledIntoView(elem){
    var $elem = $(elem);
    var $window = $(window);

    var docViewTop = $window.scrollTop();
    var docViewBottom = docViewTop + $window.height();

    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
  }

// ...............................................PROJECT SLIDESHOW.....................................................
// referenced from https://www.w3schools.com/howto/howto_js_slideshow.asp

var slideIndex = 1;
var slides = document.getElementsByClassName("individual-project")
var container = document.getElementById('project-wrapper')
const mq = window.matchMedia( "(max-width: 700px)" )
// For example, get window size on window resize
$(window).resize(function() {
  if (mq.matches) {
    container.style.display = "flex"
        // alert("window width <= 700px");
  } else {
      // alert("window width > 700px");
      showSlides(slideIndex);  
  }
})

$(document).ready(function(){
  if (mq.matches) {
    container.style.display = "flex"
        // alert("window width <= 700px");
  } else {
      // alert("window width > 700px");
      showSlides(slideIndex);  
  }
})


function plusSlides(n) {
  showSlides(slideIndex += n);
}

function showSlides(n) {
  var i;
  
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  slides[slideIndex-1].style.display = "block";  
 
}

// ...............................................MENU NAV.....................................................
$(document).ready(function(){
	$('#nav-icon').click(function(){
    $(this).toggleClass('open-nav')
    $('#wrapper').toggleClass('open-nav')
    $('#menu-wrapper').toggleClass('open-nav')
    $('#menu-wrapper').slideToggle()
    $('.list-item').click(function () {
      $('#menu-wrapper').slideUp()
      $('#nav-icon').removeClass('open-nav')
      $('#wrapper').removeClass('open-nav')
    })
	});
});

// ...............................................SCROLL BUTTON.....................................................
let scrollIndex = 0
let pagesArr = $('.page')
$('#scroll-btn').click(function(){
  scrollTo(scrollIndex += 1)
})

function scrollTo(n) {
  var i;
  
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  slides[slideIndex-1].style.display = "block";  
 
}
$('.dot').click(function(e) {
  let id = $(this).find("a").attr("href")

  $(".dot").removeClass("active")
  e.preventDefault(); //stop regular anchor behavior
  // e.stopPropagation();
  let $target = $(e.target)
  $target.addClass('active')
  $('#wrapper').stop().animate({
      'scrollTop':  $('#wrapper').scrollTop() + $(`${id}`).offset().top //added bc div is inside a div
  }, 700, 'linear', function () {
      window.location.hash = `${id}`;
  })
})


var ary = [0,1,2]
ary[10] = 10
ary.filter(function(x) { return x % 2 === 0})

var ary = [ '55', 1 , '3' ]
ary[0]=2
ary.map(function(elem) { return elem + '1' })


var wdiInstructors = [
  {
    name: {
      first: 'Andrew',
      last: 'Whitley'
    },
    cohort: 19
  },
  {
    name: {
      first: 'Perry',
      last: 'Fustero'
    },
    cohort: 1
  }
]