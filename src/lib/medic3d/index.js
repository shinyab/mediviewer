import JSZIP from 'jszip'
import * as THREE from 'three';
import Medic3D from '../../../../Medic3D/dist/medic3d'
var PNG = require('pngjs').PNG;

// standard global variables
let ready = false;

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
  light: null,
  offset: null
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
  localizerScene: null,
  name: 'r1',
  offset: null
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
  localizerScene: null,
  name: 'r2',
  offset: null
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
  localizerScene: null,
  name: 'r3',
  offset: null
};

let gStack = null;
export function getStack () {
  return gStack;
};

// extra variables to show mesh plane intersections in 2D renderers
let sceneClip = new THREE.Scene();
let clipPlane1 = new THREE.Plane(new THREE.Vector3(0, 0, 0), 0);
let clipPlane2 = new THREE.Plane(new THREE.Vector3(0, 0, 0), 0);
let clipPlane3 = new THREE.Plane(new THREE.Vector3(0, 0, 0), 0);

// Todo : event driven
let eventListener = null;

export function init () {
  /**
   * Called on each animation frame
   */
  // let sl = 0;
  function animate () {
    // we are ready when both meshes have been loaded
    if (ready) {
      // console.log('#animate');
      // render
      r0.controls.update(); // trackball.update
      r1.controls.update();
      r2.controls.update();
      r3.controls.update();

      r0.light.position.copy(r0.camera.position);
      r0.renderer.render(r0.scene, r0.camera);

      renderDo(r1);
      renderDo(r2);
      renderDo(r3);
    }
    // request new frame
    requestAnimationFrame(function () {
      animate();
    });
  }

  function renderDo (render) {
    render.renderer.clear();
    render.renderer.render(render.scene, render.camera);
    // mesh
    render.renderer.clearDepth();
    render.renderer.render(sceneClip, render.camera);
    // localizer
    render.renderer.clearDepth();
    render.renderer.render(render.localizerScene, render.camera);
  }

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
      45, renderObj.domElement.clientWidth / renderObj.domElement.clientHeight, 0.1, 100000);
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

  computeOffset(renderObj);
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
  rendererObj.renderer.setSize(rendererObj.domElement.clientWidth, rendererObj.domElement.clientHeight);
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
  rendererObj.controls = new Medic3D.Controls.TrackballOrtho(rendererObj.camera, rendererObj.domElement);
  rendererObj.controls.staticMoving = true;
  rendererObj.controls.noRotate = true;
  rendererObj.camera.controls = rendererObj.controls;

  // scene
  rendererObj.scene = new THREE.Scene();

  computeOffset(rendererObj);
}

var ctrlMprGuide = false;

export function loadZip (uploadedFile, cb) {
  eventListener = cb;
  return new Promise((resolve, reject) => {
    JSZIP.loadAsync(uploadedFile)
      .then(function (zip) {
        return extractZip(zip, 'uint8array');
      })
      .then(function (buffer) {
        console.log('Extracted zip files is read');
        let LoadersVolume = Medic3D.Loaders.Volume    // export default { Volume }
        let loader = new LoadersVolume()

        loader.loadZip(buffer)  //
          .then(function () {
            // {Array.<ModelsSeries>} Array of series properly merged.
            let series = loader.data[0].mergeSeries(loader.data)[0] // loader.data = series
            loader.free()
            loader = null

            // get first stack from series
            let stack = series.stack[0]
            // Compute cosines
            // Order frames
            // computeSpacing
            // snityCheck
            // init some vars
            // compute min/max
            // compute transformation matrices
            stack.prepare()

            // To decide what type of split window(1*1, 2*2)
            // Split is set as 1*1 if slice is one
            // domIDs are already defined as layout-1-1, layout-1-2, layout-2-1, layout-2-2
            // center 3d camera/control on the stack
            let centerLPS = stack.worldCenter();
            r0.camera.lookAt(centerLPS.x, centerLPS.y, centerLPS.z);
            r0.camera.updateProjectionMatrix();
            r0.controls.target.set(centerLPS.x, centerLPS.y, centerLPS.z);

            // bouding box
            r0.scene.add(new Medic3D.Helpers.BoundingBox(stack));

            combineMpr(r0, r1, stack);
            combineMpr(r0, r2, stack);
            combineMpr(r0, r3, stack);

            initHelpersLocalizerAll(stack);

            if (ctrlMprGuide) {
              onGreenChanged();
              onRedChanged();
              onYellowChanged();
            }

            // event listeners
            // r0.domElement.addEventListener('dblclick', onDoubleClick);
            // r1.domElement.addEventListener('dblclick', onDoubleClick);
            // r2.domElement.addEventListener('dblclick', onDoubleClick);
            // r3.domElement.addEventListener('dblclick', onDoubleClick);
            // add click event
            r0.domElement.addEventListener('click', onClick);
            r1.domElement.addEventListener('click', onClick);
            r2.domElement.addEventListener('click', onClick);
            r3.domElement.addEventListener('click', onClick);
            // add scroll event
            r1.controls.addEventListener('OnScroll', onScroll);
            r2.controls.addEventListener('OnScroll', onScroll);
            r3.controls.addEventListener('OnScroll', onScroll);
            // add others event
            r1.controls.addEventListener('mousedown', onDown);
            r1.controls.addEventListener('mousemove', onMove);
            r1.controls.addEventListener('mouseup', onUp);

            window.addEventListener('resize', onWindowResize, false);
            ready = true;
            gStack = stack;
            resolve(true);
          })
      })
  });
}

/**
 *
 * @param target 3D Viewer
 * @param plane one of orthogonal view
 * @param stack series dicom
 */
function combineMpr (target, plane, stack) {
  initHelpersStack(plane, stack);
  target.scene.add(plane.scene);
}

function initHelpersLocalizerAll (stack) {
// create new mesh with Localizer shaders
  let plane1 = r1.stackHelper.slice.cartesianEquation();
  let plane2 = r2.stackHelper.slice.cartesianEquation();
  let plane3 = r3.stackHelper.slice.cartesianEquation();

// localizer red slice
  initHelpersLocalizer(r1, stack, plane1,
    [
      {
        plane: plane2,
        color: new THREE.Color(r2.stackHelper.borderColor)
      },
      {
        plane: plane3,
        color: new THREE.Color(r3.stackHelper.borderColor)
      }
    ]);

// localizer yellow slice
  initHelpersLocalizer(r2, stack, plane2,
    [
      {
        plane: plane1,
        color: new THREE.Color(r1.stackHelper.borderColor)
      },
      {
        plane: plane3,
        color: new THREE.Color(r3.stackHelper.borderColor)
      }
    ]);

// localizer green slice
  initHelpersLocalizer(r3, stack, plane3,
    [
      {
        plane: plane1,
        color: new THREE.Color(r1.stackHelper.borderColor)
      },
      {
        plane: plane2,
        color: new THREE.Color(r2.stackHelper.borderColor)
      }
    ]);
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

// Todo : to create slice mesh for display segmentation.
// Slice has to be transference
export function loadSegmentation (uploadedFile) {
  JSZIP.loadAsync(uploadedFile)
    .then(function (zip) {
      return extractZip(zip, 'arraybuffer');
    })
    .then(function (buffer) {
      return loadZipPngs(buffer)
    })
    .then(function (data) {
      console.log('Loaded seg. ' + data.length);

      var stack = getStack();
      if (stack !== null) {
        console.log('rawdata size ' + stack.rawData.length);
        console.log('stack._frame.length ' + stack._frame.length);
        console.log('stack.rawData.length ' + stack.rawData.length);

        for (var fr = 0; fr < stack._frame.length; fr++) {
          for (var y = 0; y < 256; y++) {
            for (var x = 0; x < 256; x++) {
              var po = (y * 255 + x) * 4;
              if (data[fr].data[po] !== 0 ||
              data[fr].data[po + 1] !== 0 ||
              data[fr].data[po + 2] !== 0) {
                stack._frame[fr]._pixelData[y * 255 + x] = 450;
              }
            }
          }
        }

        removeSceneByName(r1);
        removeSceneByName(r2);
        removeSceneByName(r3);

        combineMpr(r0, r1, getStack());
        combineMpr(r0, r2, getStack());
        combineMpr(r0, r3, getStack());
      }
    });
}

function removeSceneByName (render) {
  var selectedObj = r0.scene.getObjectByName(render.name);
  if (selectedObj === null) {
    console.log('Not found Object3D ' + render.name);
    return;
  } else {
    console.log('Found Object3D ' + render.name);
  }
  r0.scene.remove(r0.scene.getObjectByName(render.name));
  render.scene.remove(render.scene.getObjectByName(render.name));
}

function loadZipPngs (zip) {
  const loadSequencesSeg = [];

  zip.forEach((rawdata) => {
    loadSequencesSeg.push(
      loadSegmentationRawdata(rawdata)
    );
  });

  return Promise.all(loadSequencesSeg);
}

function loadSegmentationRawdata (rawdata) {
  return new Promise((resolve, reject) => {
    new PNG({filterType: 4}).parse(rawdata, function (error, data) {
      if (error) {
        console.log('Error : ' + error);
      }
      console.log('loaded png' + data);
      resolve(data);
    });
  });
}

function initHelpersStack (rendererObj, stack) {
  rendererObj.stackHelper = new Medic3D.Helpers.Stack(stack); // create texture, bbox, slice
  rendererObj.stackHelper.bbox.visible = false;
  rendererObj.stackHelper.borderColor = rendererObj.sliceColor;
  rendererObj.stackHelper.slice.canvasWidth = rendererObj.domElement.clientWidth;
  rendererObj.stackHelper.slice.canvasHeight = rendererObj.domElement.clientHeight;

  // for removing THREE.Object3D by name
  rendererObj.stackHelper.name = rendererObj.name;

  // set camera
  let worldbb = stack.worldBoundingBox();
  let lpsDims = new THREE.Vector3(
    (worldbb[1] - worldbb[0]) / 2,
    (worldbb[3] - worldbb[2]) / 2,
    (worldbb[5] - worldbb[4]) / 2
  );

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

  rendererObj.camera.directions = [stack.xCosine, stack.yCosine, stack.zCosine];
  rendererObj.camera.box = box;
  rendererObj.camera.canvas = canvas;
  rendererObj.camera.orientation = rendererObj.sliceOrientation;
  rendererObj.camera.update();
  rendererObj.camera.fitBox(2, 1);  // direction, factor
  rendererObj.stackHelper.orientation = rendererObj.camera.stackOrientation;
  rendererObj.stackHelper.index = Math.floor(rendererObj.stackHelper.orientationMaxIndex / 2);  // move to mid of slice
  rendererObj.scene.add(rendererObj.stackHelper); // stackHelper extends THREE.Object3D
}

function initHelpersLocalizer (rendererObj, stack, referencePlane, localizers) {
  rendererObj.localizerHelper = new Medic3D.Helpers.Localizer(
    stack, rendererObj.stackHelper.slice.geometry, referencePlane);

  for (let i = 0; i < localizers.length; i++) {
    rendererObj.localizerHelper['plane' + (i + 1)] = localizers[i].plane;
    rendererObj.localizerHelper['color' + (i + 1)] = localizers[i].color;
  }

  rendererObj.localizerHelper.canvasWidth = rendererObj.domElement.clientWidth;
  rendererObj.localizerHelper.canvasHeight = rendererObj.domElement.clientHeight;
  rendererObj.localizerScene = new THREE.Scene();
  rendererObj.localizerScene.add(rendererObj.localizerHelper);
}

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
  let p1 = new THREE.Vector3(vertices[0].x, vertices[0].y, vertices[0].z).applyMatrix4(stackHelper._stack.ijk2LPS);
  let p2 = new THREE.Vector3(vertices[1].x, vertices[1].y, vertices[1].z).applyMatrix4(stackHelper._stack.ijk2LPS);
  let p3 = new THREE.Vector3(vertices[2].x, vertices[2].y, vertices[2].z).applyMatrix4(stackHelper._stack.ijk2LPS);

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

function onRedChanged () {
  updateLocalizer(r1, [r2.localizerHelper, r3.localizerHelper]);
  updateClipPlane(r1, clipPlane1);
}

function onGreenChanged () {
  updateLocalizer(r3, [r1.localizerHelper, r2.localizerHelper]);
  updateClipPlane(r3, clipPlane3);
}

// function onDoubleClick (event) {
//   const canvas = event.target.parentElement;
//   const id = event.target.id;
//   const mouse = {
//     x: ((event.clientX - canvas.offsetLeft) / canvas.clientWidth) * 2 - 1,
//     y: -((event.clientY - canvas.offsetTop) / canvas.clientHeight) * 2 + 1
//   };
//   //
//   let camera = null;
//   let stackHelper = null;
//   let scene = null;
//   switch (id) {
//     case '0':
//       camera = r0.camera;
//       stackHelper = r1.stackHelper;
//       scene = r0.scene;
//       break;
//     case '1':
//       camera = r1.camera;
//       stackHelper = r1.stackHelper;
//       scene = r1.scene;
//       break;
//     case '2':
//       camera = r2.camera;
//       stackHelper = r2.stackHelper;
//       scene = r2.scene;
//       break;
//     case '3':
//       camera = r3.camera;
//       stackHelper = r3.stackHelper;
//       scene = r3.scene;
//       break;
//   }
//
//   const raycaster = new THREE.Raycaster();
//   raycaster.setFromCamera(mouse, camera);
//
//   const intersects = raycaster.intersectObjects(scene.children, true);
//   if (intersects.length > 0) {
//     let ijk =
//       // CoreUtils.worldToData(stackHelper.stack.lps2IJK, intersects[0].point);
//       Medic3D.Core.Utils.worldToData(stackHelper.stack.lps2IJK, intersects[0].point);
//
//     r1.stackHelper.index = ijk.getComponent((r1.stackHelper.orientation + 2) % 3);
//     r2.stackHelper.index = ijk.getComponent((r2.stackHelper.orientation + 2) % 3);
//     r3.stackHelper.index = ijk.getComponent((r3.stackHelper.orientation + 2) % 3);
//
//     onGreenChanged();
//     onRedChanged();
//     onYellowChanged();
//   }
// }

function onScroll (event) {
  console.log('# onScroll');
  const id = event.target.domElement.id;
  let stackHelper = null;

  let msg = {
    type: 'slice'
  };

  switch (id) {
    case r1.domId:
      stackHelper = r1.stackHelper;
      msg.view = 'r1';
      break;
    case r2.domId:
      stackHelper = r2.stackHelper;
      msg.view = 'r2';
      break;
    case r3.domId:
      stackHelper = r3.stackHelper;
      msg.view = 'r3';
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
  console.log('stackHelper ' + stackHelper.index);
  onGreenChanged();
  onRedChanged();
  onYellowChanged();
  msg.slice = stackHelper.index;

  eventListener(msg);
}

function onDown (event) {
  console.log('#down');
}

function onMove (event) {
  console.log('#move');
}

function onUp (event) {
  console.log('#up');
}

function windowResize2D (rendererObj) {
  rendererObj.camera.canvas = {
    width: rendererObj.domElement.clientWidth,
    height: rendererObj.domElement.clientHeight
  };
  rendererObj.camera.fitBox(2, 1);
  rendererObj.renderer.setSize(rendererObj.domElement.clientWidth, rendererObj.domElement.clientHeight);

  // update info to draw borders properly
  rendererObj.stackHelper.slice.canvasWidth = rendererObj.domElement.clientWidth;
  rendererObj.stackHelper.slice.canvasHeight = rendererObj.domElement.clientHeight;
  rendererObj.localizerHelper.canvasWidth = rendererObj.domElement.clientWidth;
  rendererObj.localizerHelper.canvasHeight = rendererObj.domElement.clientHeight;
  computeOffset(rendererObj);
}

function onWindowResize () {
  // update 3D
  r0.camera.aspect = r0.domElement.clientWidth / r0.domElement.clientHeight;
  r0.camera.updateProjectionMatrix();
  r0.renderer.setSize(r0.domElement.clientWidth, r0.domElement.clientHeight);

  // update 2d
  windowResize2D(r1);
  windowResize2D(r2);
  windowResize2D(r3);

  computeOffset(r0);
}

function computeOffset (renderObj) {
  let box = renderObj.domElement.getBoundingClientRect();
  const body = document.body;
  const docEl = document.documentElement;

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft =
    window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  const clientTop = docEl.clientTop || body.clientTop || 0;
  const clientLeft = docEl.clientLeft || body.clientLeft || 0;

  const top = box.top + scrollTop - clientTop;
  const left = box.left + scrollLeft - clientLeft;

  renderObj.offset = {
    top: Math.round(top),
    left: Math.round(left)
  };

  // repaint all widgets
  for (let widget of widgets) {
    widget.update();
  }
}

function onClick (event) {
  console.log('#onClick');
  // const canvas = event.target.parentElement;
  // const id = event.target.id;
  // const mouse = {
  //   x: ((event.clientX - canvas.offsetLeft) / canvas.clientWidth) * 2 - 1,
  //   y: -((event.clientY - canvas.offsetTop) / canvas.clientHeight) * 2 + 1
  // };
  // //
  // let camera = null;
  // let stackHelper = null;
  // let scene = null;
  // switch (id) {
  //   case '0':
  //     camera = r0.camera;
  //     stackHelper = r0.stackHelper;
  //     scene = r0.scene;
  //     break;
  //   case '1':
  //     camera = r1.camera;
  //     stackHelper = r1.stackHelper;
  //     scene = r1.scene;
  //     r1.stackHelper.slice.windowCenter += 2;
  //     break;
  //   case '2':
  //     camera = r2.camera;
  //     stackHelper = r2.stackHelper;
  //     scene = r2.scene;
  //     r2.stackHelper.slice.windowCenter += 2;
  //     break;
  //   case '3':
  //     camera = r3.camera;
  //     stackHelper = r3.stackHelper;
  //     scene = r3.scene;
  //     r3.stackHelper.slice.windowCenter += 2;
  //     break;
  // }
  //
  // // console.log(stackHelper);
  //
  // const raycaster = new THREE.Raycaster();
  // raycaster.setFromCamera(mouse, camera);
  //
  // const intersects = raycaster.intersectObjects(scene.children, true);
  // if (intersects.length > 0) {
  //   if (intersects[0].object && intersects[0].object.objRef) {
  //     const refObject = intersects[0].object.objRef;
  //     refObject.selected = !refObject.selected;
  //
  //     let color = refObject.color;
  //     if (refObject.selected) {
  //       color = 0xCCFF00;
  //     }
  //
  //     // update materials colors
  //     refObject.material.color.setHex(color);
  //     refObject.materialFront.color.setHex(color);
  //     refObject.materialBack.color.setHex(color);
  //   }
  // }
}

export function Zoom (id, action) {
  if (id === r0.domId) {
    let delta = 3;
    if (action) {
      delta = -3;
    }
    CameraCtrl3D(delta);
  } else {
    CameraCtrl2D(id, action);
  }
}

/**
 * Zoom control
 * @param id selected div's id
 * @param action : true - zoomin, false - zoomout
 * @constructor
 */
function CameraCtrl2D (id, action) {
  let selected = getView(id);
  if (selected === null) {
    return;
  }

  let val;
  if (action) {
    val = -0.1;
  } else {
    val = 0.1;
  }
  selected.camera.zoom += val;
  selected.camera.updateProjectionMatrix();
}

function CameraCtrl3D (delta) {
  r0.controls.zoomCtrl(delta);
}

export function Fit (id) {
  let selected = getView(id);
  if (selected === null) {
    return;
  }

  selected.camera.fitBox(2, 0.9);
}

/**
 * To fit view
 * @param id selected div's id
 * @return {*}
 */
function getView (id) {
  let selected = null;
  switch (id) {
    case r1.domId:
      selected = r1;
      break;
    case r2.domId:
      selected = r2;
      break;
    case r3.domId:
      selected = r3;
      break;
    default:
      console.log('unselected or r1 is selected');
  }

  return selected;
}

export function Invert () {
  if (r1.stackHelper !== null && r1.stackHelper.slice !== null) {
    let newVal;
    if (r1.stackHelper.slice.invert) {
      newVal = false;
    } else {
      newVal = true;
    }
    r1.stackHelper.slice.invert = newVal;
    r2.stackHelper.slice.invert = newVal;
    r3.stackHelper.slice.invert = newVal;
  }
}

export function CameraCtrl (enable) {
  console.log('#cam ctrl ' + enable)
  r1.controls.viewcontrol = enable;
  r2.controls.viewcontrol = enable;
  r3.controls.viewcontrol = enable;
}

export function adjustBrightness (delta) {
  if (r1.stackHelper !== null) {
    let val = delta / 5;
    r1.stackHelper.slice.windowCenter += val;
    r2.stackHelper.slice.windowCenter += val;
    r3.stackHelper.slice.windowCenter += val;
  }
}

/**
 * To do something for annotation
 * @param action : mouse type
 * @param event : mouse event
 */
export function doAnnotation (id, action, event) {
  let selected = getView(id);
  if (selected === null) {
    return;
  }

  switch (event.type) {
    case 'mousedown':
      downAnnotation(action, event, selected);
      break;
    case 'mousemove':
      moveAnnotation(action, event, selected);
      break;
    case 'mouseup':
      upAnnotation(action, event, selected);
      break;
  }
}

let widgets = [];
function downAnnotation (action, evt, element) {
  var threeD = element.domElement;
  if (threeD === null) {
    return;
  }

  var camera = element.camera;
  var stackHelper = element.stackHelper;

  // if something hovered, exit
  for (let widget of widgets) {
    if (widget.hovered) {
      widget.onStart(evt);
      return;
    }
  }

  threeD.style.cursor = 'default';

  // mouse position
  let mouse = {
    x: (evt.clientX - element.offset.left) / threeD.offsetWidth * 2 - 1,
    y: -((evt.clientY - element.offset.top) / threeD.offsetHeight) * 2 + 1
  };

  if (camera && camera.isOrthographicCamera) {
    console.log('###Orthogonal view');
  } else if (camera && camera.isPerspectiveCamera) {
    console.log('###Perspective view');
  }

  let raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  // update the raycaster
  let intersects = raycaster.intersectObject(stackHelper.slice.mesh);
  if (intersects.length <= 0) {
    console.log('## no raycasting');
    // return;
  } else {
    console.log('## raycasting count is ' + intersects.length);
  }

  var controls = element.controls;
  var scene = element.scene;
  let widget = null;
  switch (action) {
    case 'Ruler':
      widget =
        new Medic3D.Widgets.Ruler(stackHelper.slice.mesh, controls, camera, threeD);
      widget.worldPosition = intersects[0].point;
      break;
    case 'Annotation':
      widget =
        new Medic3D.Widgets.Annotation(stackHelper.slice.mesh, controls, camera, threeD);
      widget.worldPosition = intersects[0].point;
      break;
    case 'Biruler':
    case 'Protractor':
      widget =
        new Medic3D.Widgets.BiRuler(stackHelper.slice.mesh, controls, camera, threeD);
      widget.worldPosition = intersects[0].point;
      break;
    default:
      widget =
        new Medic3D.Widgets.Handle(stackHelper.slice.mesh, controls, camera, threeD);
      widget.worldPosition = intersects[0].point;
      break;
  }

  widgets.push(widget);
  scene.add(widget);
}

function moveAnnotation (action, evt, element) {
  var threeD = element.domElement;
  if (threeD === null) {
    return;
  }

  // if something hovered, exit
  let cursor = 'default';
  for (let widget of widgets) {
    widget.onMove(evt);
    if (widget.hovered) {
      cursor = 'pointer';
    }
  }

  threeD.style.cursor = cursor;
}

function upAnnotation (action, evt, element) {
  // if something hovered, exit
  for (let widget of widgets) {
    if (widget.active) {
      widget.onEnd(evt);
      return;
    }
  }
}
