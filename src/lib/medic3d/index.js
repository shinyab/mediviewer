import JSZIP from 'jszip'
import * as THREE from 'three';
import Medic3D from '../../../../Medic3D/dist/medic3d'
// import * as fs from 'fs'
// import PNG from 'pngjs'
var PNG = require('pngjs').PNG;

// standard global variables
let ready = false;

let redTextureTarget = null;
let redContourMesh = null;
let redCountourScene = null;
let redContourMaterial = null;

// 3d renderer
const r0 = {
  domId: 'layout-1-1',
  domElement: null,
  renderer: null,
  color: 0x212121,
  targetID: 0,
  camera: null,
  controls: null,
  scene: null,
  light: null
};

// 2d axial renderer
const r1 = {
  domId: 'layout-1-2',
  domElement: null,
  renderer: null,
  color: 0x121212,
  sliceOrientation: 'axial',
  sliceColor: 0xFF1744,
  targetID: 1,
  camera: null,
  controls: null,
  scene: null,
  light: null,
  stackHelper: null,
  localizerHelper: null,
  localizerScene: null
};

// 2d sagittal renderer
const r2 = {
  domId: 'layout-2-1',
  domElement: null,
  renderer: null,
  color: 0x121212,
  sliceOrientation: 'sagittal',
  sliceColor: 0xFFEA00,
  targetID: 2,
  camera: null,
  controls: null,
  scene: null,
  light: null,
  stackHelper: null,
  localizerHelper: null,
  localizerScene: null
};

// 2d coronal renderer
const r3 = {
  domId: 'layout-2-2',
  domElement: null,
  renderer: null,
  color: 0x121212,
  sliceOrientation: 'coronal',
  sliceColor: 0x76FF03,
  targetID: 3,
  camera: null,
  controls: null,
  scene: null,
  light: null,
  stackHelper: null,
  localizerHelper: null,
  localizerScene: null
};

export function init () {
  /**
   * Called on each animation frame
   */
  function animate () {
    // we are ready when both meshes have been loaded
    if (ready) {
      // console.log('#animate');
      // render
      r0.controls.update();
      r1.controls.update();
      r2.controls.update();
      r3.controls.update();

      r0.light.position.copy(r0.camera.position);
      r0.renderer.render(r0.scene, r0.camera);

      // r1
      r1.renderer.clear();
      r1.renderer.render(r1.scene, r1.camera);
      // mesh
      r1.renderer.clearDepth();
      // localizer
      r1.renderer.clearDepth();
      r1.renderer.render(r1.localizerScene, r1.camera);

      // r2
      r2.renderer.clear();
      r2.renderer.render(r2.scene, r2.camera);
      // mesh
      r2.renderer.clearDepth();
      r2.renderer.render(sceneClip, r2.camera);
      // localizer
      r2.renderer.clearDepth();
      r2.renderer.render(r2.localizerScene, r2.camera);

      // r3
      r3.renderer.clear();
      r3.renderer.render(r3.scene, r3.camera);
      // mesh
      r3.renderer.clearDepth();
      r3.renderer.render(sceneClip, r3.camera);
      // localizer
      r3.renderer.clearDepth();
      r3.renderer.render(r3.localizerScene, r3.camera);
    }
    // request new frame
    requestAnimationFrame(function () {
      animate();
    });
  }

  // renderers
  if (ready) {
    console.log('Already setup');
    clearThree(r0.scene);
    clearThree(r1.scene);
    clearThree(r2.scene);
    clearThree(r3.scene);
  } else {
    console.log('First time');
  }
  initRenderer3D(r0);
  initRenderer2D(r3);
  initRenderer2D(r2);
  initRenderer2D(r1);

  // start rendering loop
  animate();
}

function clearThree (scene) {
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
}

// extra variables to show mesh plane intersections in 2D renderers
let sceneClip = new THREE.Scene();
let clipPlane1 = new THREE.Plane(new THREE.Vector3(0, 0, 0), 0);
let clipPlane2 = new THREE.Plane(new THREE.Vector3(0, 0, 0), 0);
let clipPlane3 = new THREE.Plane(new THREE.Vector3(0, 0, 0), 0);

function initRenderer3D (renderObj) {
  // renderer
  if (renderObj.domElement === null) {
    renderObj.domElement = document.getElementById(renderObj.domId);
  } else {
    return;
  }

  if (renderObj.renderer === null) {
    renderObj.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderObj.renderer.setSize(renderObj.domElement.clientWidth, renderObj.domElement.clientHeight);
    renderObj.renderer.setClearColor(renderObj.color, 1);
    renderObj.renderer.domElement.id = renderObj.targetID;
  }

  renderObj.domElement.appendChild(renderObj.renderer.domElement);

  if (renderObj.domElement == null) {
    return;
  }
  // camera
  if (renderObj.camera === null) {
    renderObj.camera = new THREE.PerspectiveCamera(
      45, renderObj.domElement.clientWidth / renderObj.domElement.clientHeight,
      0.1, 100000);
    renderObj.camera.position.x = 250;
    renderObj.camera.position.y = 250;
    renderObj.camera.position.z = 250;
  }

  // controls
  if (renderObj.controls === null) {
    renderObj.controls = new Medic3D.Controls.Trackball(renderObj.camera, renderObj.domElement);
    renderObj.controls.rotateSpeed = 5.5;
    renderObj.controls.zoomSpeed = 1.2;
    renderObj.controls.panSpeed = 0.8;
    renderObj.controls.staticMoving = true;
    renderObj.controls.dynamicDampingFactor = 0.3;
  }

  // scene
  if (renderObj.scene === null) {
    renderObj.scene = new THREE.Scene();
  }

  // light
  if (renderObj.light === null) {
    renderObj.light = new THREE.DirectionalLight(0xffffff, 1);
    renderObj.light.position.copy(renderObj.camera.position);
    renderObj.scene.add(renderObj.light);
  }
}

function initRenderer2D (rendererObj) {
  // renderer
  if (rendererObj.domElement === null) {
    rendererObj.domElement = document.getElementById(rendererObj.domId);
  } else {
    return;
  }

  rendererObj.renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  rendererObj.renderer.autoClear = false;
  rendererObj.renderer.localClippingEnabled = true;
  rendererObj.renderer.setSize(
    rendererObj.domElement.clientWidth, rendererObj.domElement.clientHeight);
  rendererObj.renderer.setClearColor(0x121212, 1);
  rendererObj.renderer.domElement.id = rendererObj.targetID;
  rendererObj.domElement.appendChild(rendererObj.renderer.domElement);

  // camera
  rendererObj.camera = new Medic3D.Cameras.Orthographic(
    rendererObj.domElement.clientWidth / -2,
    rendererObj.domElement.clientWidth / 2,
    rendererObj.domElement.clientHeight / 2,
    rendererObj.domElement.clientHeight / -2,
    1, 1000);

  // controls
  rendererObj.controls = new Medic3D.Controls.TrackballOrtho(
    rendererObj.camera, rendererObj.domElement);
  rendererObj.controls.staticMoving = true;
  rendererObj.controls.noRotate = true;
  rendererObj.camera.controls = rendererObj.controls;

  // scene
  rendererObj.scene = new THREE.Scene();
}

export function loadZip (uploadedFile) {
  JSZIP.loadAsync(uploadedFile)
    .then(function (zip) {
      return extractZip(zip, 'uint8array');
    })
    .then(function (buffer) {
      console.log('Extracted zip files is read');
      let LoadersVolume = Medic3D.Loaders.Volume    // export default { Volume }
      let loader = new LoadersVolume()

      loader.loadZip(buffer)
        .then(function () {
          let series = loader.data[0].mergeSeries(loader.data)[0]
          loader.free()
          loader = null

          // get first stack from series
          let stack = series.stack[0]
          stack.prepare()

          console.log('slice ' + stack._numberOfFrames);

          // To decide what type of split window(1*1, 2*2)
          // Split is set as 1*1 if slice is one
          // domIDs are already defined as layout-1-1, layout-1-2, layout-2-1, layout-2-2
          // center 3d camera/control on the stack
          let centerLPS = stack.worldCenter();
          r0.camera.lookAt(centerLPS.x, centerLPS.y, centerLPS.z);
          r0.camera.updateProjectionMatrix();
          r0.controls.target.set(centerLPS.x, centerLPS.y, centerLPS.z);

          // bouding box
          let boxHelper = new Medic3D.Helpers.BoundingBox(stack);
          r0.scene.add(boxHelper);

          // red slice
          initHelpersStack(r1, stack);
          r0.scene.add(r1.scene);

          redTextureTarget = new THREE.WebGLRenderTarget(
            r1.domElement.clientWidth,
            r1.domElement.clientHeight,
            {
              minFilter: THREE.LinearFilter,
              magFilter: THREE.NearestFilter,
              format: THREE.RGBAFormat
            }
          );
          // need 1 per tooth...
          let uniformsLayerMix = Medic3D.Shaders.ContourUniform.uniforms();
          uniformsLayerMix.uTextureFilled.value = redTextureTarget.texture;
          uniformsLayerMix.uWidth.value = 1.0;
          uniformsLayerMix.uCanvasWidth.value = redTextureTarget.width;
          uniformsLayerMix.uCanvasHeight.value = redTextureTarget.height;

          let fls = new Medic3D.Shaders.ContourFragment(uniformsLayerMix);
          let vls = new Medic3D.Shaders.ContourVertex();
          redContourMaterial = new THREE.ShaderMaterial(
            {side: THREE.DoubleSide,
              uniforms: uniformsLayerMix,
              vertexShader: vls.compute(),
              fragmentShader: fls.compute(),
              transparent: true,
              extensions: {
                derivatives: true
              }
            });
          redContourMesh = new THREE.Mesh(
            r1.stackHelper.slice.geometry, redContourMaterial);
          redCountourScene = new THREE.Scene(redContourMesh);

          // yellow slice
          initHelpersStack(r2, stack);
          r0.scene.add(r2.scene);

          // green slice
          initHelpersStack(r3, stack);
          r0.scene.add(r3.scene);

          // create new mesh with Localizer shaders
          let plane1 = r1.stackHelper.slice.cartesianEquation();
          let plane2 = r2.stackHelper.slice.cartesianEquation();
          let plane3 = r3.stackHelper.slice.cartesianEquation();

          // localizer red slice
          initHelpersLocalizer(r1, stack, plane1, [
            {plane: plane2,
              color: new THREE.Color(r2.stackHelper.borderColor)
            },
            {plane: plane3,
              color: new THREE.Color(r3.stackHelper.borderColor)
            }
          ]);

          // localizer yellow slice
          initHelpersLocalizer(r2, stack, plane2, [
            {plane: plane1,
              color: new THREE.Color(r1.stackHelper.borderColor)
            },
            {plane: plane3,
              color: new THREE.Color(r3.stackHelper.borderColor)
            }
          ]);

          // localizer green slice
          initHelpersLocalizer(r3, stack, plane3, [
            {plane: plane1,
              color: new THREE.Color(r1.stackHelper.borderColor)
            },
            {plane: plane2,
              color: new THREE.Color(r2.stackHelper.borderColor)
            }
          ]);

          /**
           * Update Layer Mix. Guide line control
           */
          function updateLocalizer (refObj, targetLocalizersHelpers) {
            let refHelper = refObj.stackHelper;
            let localizerHelper = refObj.localizerHelper;
            let plane = refHelper.slice.cartesianEquation();
            localizerHelper.referencePlane = plane;

            // bit of a hack... works fine for this application
            for (let i = 0; i < targetLocalizersHelpers.length; i++) {
              for (let j = 0; j < 3; j++) {
                let targetPlane = targetLocalizersHelpers[i]['plane' + (j + 1)];
                if (targetPlane &&
                  plane.x.toFixed(6) === targetPlane.x.toFixed(6) &&
                  plane.y.toFixed(6) === targetPlane.y.toFixed(6) &&
                  plane.z.toFixed(6) === targetPlane.z.toFixed(6)) {
                  targetLocalizersHelpers[i]['plane' + (j + 1)] = plane;
                }
              }
            }

            // update the geometry will create a new mesh
            localizerHelper.geometry = refHelper.slice.geometry;
          }

          function updateClipPlane (refObj, clipPlane) {
            const stackHelper = refObj.stackHelper;
            const camera = refObj.camera;
            let vertices = stackHelper.slice.geometry.vertices;
            let p1 = new THREE.Vector3(vertices[0].x, vertices[0].y, vertices[0].z)
              .applyMatrix4(stackHelper._stack.ijk2LPS);
            let p2 = new THREE.Vector3(vertices[1].x, vertices[1].y, vertices[1].z)
              .applyMatrix4(stackHelper._stack.ijk2LPS);
            let p3 = new THREE.Vector3(vertices[2].x, vertices[2].y, vertices[2].z)
              .applyMatrix4(stackHelper._stack.ijk2LPS);

            clipPlane.setFromCoplanarPoints(p1, p2, p3);

            let cameraDirection = new THREE.Vector3(1, 1, 1);
            cameraDirection.applyQuaternion(camera.quaternion);

            if (cameraDirection.dot(clipPlane.normal) > 0) {
              clipPlane.negate();
            }
          }

          function onYellowChanged () {
            updateLocalizer(r2, [r1.localizerHelper, r3.localizerHelper]);
            updateClipPlane(r2, clipPlane2);
          }

          // yellowChanged.onChange(onYellowChanged);

          function onRedChanged () {
            updateLocalizer(r1, [r2.localizerHelper, r3.localizerHelper]);
            updateClipPlane(r1, clipPlane1);

            if (redContourMesh) {
              redCountourScene.remove(redContourMesh);
              redContourMesh.material.dispose();
              redContourMesh.material = null;
              redContourMesh.geometry.dispose();
              redContourMesh.geometry = null;

              redContourMesh = new THREE.Mesh(
                r1.stackHelper.slice.geometry, redContourMaterial);
              // go to LPS space
              redContourMesh.applyMatrix(r1.stackHelper.stack._ijk2LPS);

              redCountourScene.add(redContourMesh);
            }
          }

          function onGreenChanged () {
            updateLocalizer(r3, [r1.localizerHelper, r2.localizerHelper]);
            updateClipPlane(r3, clipPlane3);
          }

          function onDoubleClick (event) {
            const canvas = event.target.parentElement;
            const id = event.target.id;
            const mouse = {
              x: ((event.clientX - canvas.offsetLeft) / canvas.clientWidth) * 2 - 1,
              y: -((event.clientY - canvas.offsetTop) / canvas.clientHeight) * 2 + 1
            };
            //
            let camera = null;
            let stackHelper = null;
            let scene = null;
            switch (id) {
              case '0':
                camera = r0.camera;
                stackHelper = r1.stackHelper;
                scene = r0.scene;
                break;
              case '1':
                camera = r1.camera;
                stackHelper = r1.stackHelper;
                scene = r1.scene;
                break;
              case '2':
                camera = r2.camera;
                stackHelper = r2.stackHelper;
                scene = r2.scene;
                break;
              case '3':
                camera = r3.camera;
                stackHelper = r3.stackHelper;
                scene = r3.scene;
                break;
            }

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObjects(scene.children, true);
            if (intersects.length > 0) {
              let ijk =
                // CoreUtils.worldToData(stackHelper.stack.lps2IJK, intersects[0].point);
                Medic3D.Core.Utils.worldToData(stackHelper.stack.lps2IJK, intersects[0].point);

              r1.stackHelper.index =
                ijk.getComponent((r1.stackHelper.orientation + 2) % 3);
              r2.stackHelper.index =
                ijk.getComponent((r2.stackHelper.orientation + 2) % 3);
              r3.stackHelper.index =
                ijk.getComponent((r3.stackHelper.orientation + 2) % 3);

              onGreenChanged();
              onRedChanged();
              onYellowChanged();
            }
          }

          // event listeners
          r0.domElement.addEventListener('dblclick', onDoubleClick);
          r1.domElement.addEventListener('dblclick', onDoubleClick);
          r2.domElement.addEventListener('dblclick', onDoubleClick);
          r3.domElement.addEventListener('dblclick', onDoubleClick);

          function onClick (event) {
            console.log('# onClick');
            const canvas = event.target.parentElement;
            const id = event.target.id;
            const mouse = {
              x: ((event.clientX - canvas.offsetLeft) / canvas.clientWidth) * 2 - 1,
              y: -((event.clientY - canvas.offsetTop) / canvas.clientHeight) * 2 + 1
            };
            //
            let camera = null;
            let stackHelper = null;
            let scene = null;
            switch (id) {
              case '0':
                camera = r0.camera;
                stackHelper = r1.stackHelper;
                scene = r0.scene;
                break;
              case '1':
                camera = r1.camera;
                stackHelper = r1.stackHelper;
                scene = r1.scene;
                break;
              case '2':
                camera = r2.camera;
                stackHelper = r2.stackHelper;
                scene = r2.scene;
                break;
              case '3':
                camera = r3.camera;
                stackHelper = r3.stackHelper;
                scene = r3.scene;
                break;
            }

            console.log(stackHelper);

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObjects(scene.children, true);
            if (intersects.length > 0) {
              if (intersects[0].object && intersects[0].object.objRef) {
                const refObject = intersects[0].object.objRef;
                refObject.selected = !refObject.selected;

                let color = refObject.color;
                if (refObject.selected) {
                  color = 0xCCFF00;
                }

                // update materials colors
                refObject.material.color.setHex(color);
                refObject.materialFront.color.setHex(color);
                refObject.materialBack.color.setHex(color);
              }
            }
          }
          r0.domElement.addEventListener('click', onClick);

          function onScroll (event) {
            console.log('# onScroll');
            const id = event.target.domElement.id;
            let stackHelper = null;
            switch (id) {
              case r1.domId:
                stackHelper = r1.stackHelper;
                break;
              case r2.domId:
                stackHelper = r2.stackHelper;
                break;
              case r3.domId:
                stackHelper = r3.stackHelper;
                break;
              default:
                console.log('No matched ID');
                return;
            }

            if (event.delta > 0) {
              if (stackHelper.index >= stackHelper.orientationMaxIndex - 1) {
                return false;
              }
              stackHelper.index += 1;
            } else {
              if (stackHelper.index <= 0) {
                return false;
              }
              stackHelper.index -= 1;
            }
            onGreenChanged();
            onRedChanged();
            onYellowChanged();
          }

          // event listeners
          r1.controls.addEventListener('OnScroll', onScroll);
          r2.controls.addEventListener('OnScroll', onScroll);
          r3.controls.addEventListener('OnScroll', onScroll);

          function windowResize2D (rendererObj) {
            rendererObj.camera.canvas = {
              width: rendererObj.domElement.clientWidth,
              height: rendererObj.domElement.clientHeight
            };
            rendererObj.camera.fitBox(2, 1);
            rendererObj.renderer.setSize(
              rendererObj.domElement.clientWidth,
              rendererObj.domElement.clientHeight);

            // update info to draw borders properly
            rendererObj.stackHelper.slice.canvasWidth =
              rendererObj.domElement.clientWidth;
            rendererObj.stackHelper.slice.canvasHeight =
              rendererObj.domElement.clientHeight;
            rendererObj.localizerHelper.canvasWidth =
              rendererObj.domElement.clientWidth;
            rendererObj.localizerHelper.canvasHeight =
              rendererObj.domElement.clientHeight;
          }

          function onWindowResize () {
            // update 3D
            r0.camera.aspect = r0.domElement.clientWidth / r0.domElement.clientHeight;
            r0.camera.updateProjectionMatrix();
            r0.renderer.setSize(
              r0.domElement.clientWidth, r0.domElement.clientHeight);

            // update 2d
            windowResize2D(r1);
            windowResize2D(r2);
            windowResize2D(r3);
          }

          window.addEventListener('resize', onWindowResize, false);
          ready = true;
        })
    })

  // function extractZip (zip) {
  //   var files = Object.keys(zip.files)
  //   var loadData = []
  //   files.forEach(function (filename) {
  //     loadData.push(zip.files[filename].async('uint8array'))  // file data
  //   })
  //
  //   return Promise.all(loadData)
  //     .then(function (rawdata) {
  //       return rawdata
  //     })
  // }
}

function extractZip (zip, type) {
  var files = Object.keys(zip.files)
  var loadData = []
  files.forEach(function (filename) {
    loadData.push(zip.files[filename].async(type))  // file data
  })

  return Promise.all(loadData)
    .then(function (rawdata) {
      return rawdata
    })
}

export function loadSegmentation (uploadedFile) {
  JSZIP.loadAsync(uploadedFile)
    .then(function (zip) {
      // print files
      var files = Object.keys(zip.files);
      files.forEach(function (filename) {
        console.log(filename);
      });
      return extractZip(zip, 'arraybuffer');
    })
    .then(function (buffer) {
      loadZipPngs(buffer)
        .then(function () {

        });
    })
}

function loadZipPngs (zip) {
  const loadSequences = [];

  zip.forEach((rawdata) => {
    loadSequences.push(
      loadSegmentationRawdata(rawdata)
    );
  });

  return Promise.all(loadSequences);
}

function loadSegmentationRawdata (rawdata) {
  return new Promise((resolve, reject) => {
    // PNG.parse(rawdata, function (err, data) {
    //   console.log('Error : ' + err + ' Length : ' + data.length);
    // });
    // console.log('Png rawdata ' + rawdata.length);
    new PNG({filterType: 4}).parse(rawdata, function (error, data) {
      console.log(error, data);
    });
    resolve();
  });
}

function initHelpersStack (rendererObj, stack) {
  rendererObj.stackHelper = new Medic3D.Helpers.Stack(stack);
  rendererObj.stackHelper.bbox.visible = false;
  rendererObj.stackHelper.borderColor = rendererObj.sliceColor;
  rendererObj.stackHelper.slice.canvasWidth =
    rendererObj.domElement.clientWidth;
  rendererObj.stackHelper.slice.canvasHeight =
    rendererObj.domElement.clientHeight;

  // set camera
  let worldbb = stack.worldBoundingBox();
  let lpsDims = new THREE.Vector3(
    (worldbb[1] - worldbb[0]) / 2,
    (worldbb[3] - worldbb[2]) / 2,
    (worldbb[5] - worldbb[4]) / 2
  );

  // box: {halfDimensions, center}
  let box = {
    center: stack.worldCenter().clone(),
    halfDimensions:
      new THREE.Vector3(lpsDims.x + 10, lpsDims.y + 10, lpsDims.z + 10)
  };

  // init and zoom
  let canvas = {
    width: rendererObj.domElement.clientWidth,
    height: rendererObj.domElement.clientHeight
  };

  rendererObj.camera.directions =
    [stack.xCosine, stack.yCosine, stack.zCosine];
  rendererObj.camera.box = box;
  rendererObj.camera.canvas = canvas;
  rendererObj.camera.orientation = rendererObj.sliceOrientation;
  rendererObj.camera.update();
  rendererObj.camera.fitBox(2, 1);

  rendererObj.stackHelper.orientation = rendererObj.camera.stackOrientation;
  rendererObj.stackHelper.index =
    Math.floor(rendererObj.stackHelper.orientationMaxIndex / 2);
  rendererObj.scene.add(rendererObj.stackHelper);
}

function initHelpersLocalizer (rendererObj, stack, referencePlane, localizers) {
  // rendererObj.localizerHelper = new HelpersLocalizer(
  rendererObj.localizerHelper = new Medic3D.Helpers.Localizer(
    stack, rendererObj.stackHelper.slice.geometry, referencePlane);

  for (let i = 0; i < localizers.length; i++) {
    rendererObj.localizerHelper['plane' + (i + 1)] = localizers[i].plane;
    rendererObj.localizerHelper['color' + (i + 1)] = localizers[i].color;
  }

  rendererObj.localizerHelper.canvasWidth =
    rendererObj.domElement.clientWidth;
  rendererObj.localizerHelper.canvasHeight =
    rendererObj.domElement.clientHeight;

  rendererObj.localizerScene = new THREE.Scene();
  rendererObj.localizerScene.add(rendererObj.localizerHelper);
}
