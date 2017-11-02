import * as THREE from 'three';

var camera, scene, renderer;
var geometry, material, mesh;

// init();
// animate();

export function init() {
  console.log('Three')
  console.log(THREE)

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
  camera.position.z = 1;

  scene = new THREE.Scene();

  geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
  material = new THREE.MeshNormalMaterial();

  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( 800, 700 );

  // document.getElementById('layout-1-1').appendChild( renderer.domElement );
  document.getElementById('layout-1-2').appendChild( renderer.domElement );
  // document.body.appendChild( renderer.domElement );
}

export function animate() {

  requestAnimationFrame( animate );

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;

  renderer.render( scene, camera );

}
