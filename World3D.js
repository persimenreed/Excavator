import * as THREE from './js/three.module.js';
import {OrbitControls} from './js/OrbitControls.js';
import {FBXLoader} from './js/FBXLoader.js';

let cam = null;
let scene = null;
let renderer = null;
let importedObjects = null;
let Link001,Link002,Link003,Link004,Skuff001,Skuff002;

export function init(aCanvas) {
    cam = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 5000);

    cam.position.set(500, 560, 500);
    cam.lookAt(110, 100, 110);

    scene = new THREE.Scene();
    scene.background = new THREE.Color("#4c9bd7");


    //Vi lager noen lys
    let light = new THREE.HemisphereLight("#ffffff","#ffffff",0.1);
    light.position.set(0,666, 0);
    scene.add(light);

    light = new THREE.SpotLight("#FFFFFF", 1, 1000, Math.PI/4,0.7);
    light.position.set(150,350,-50);
    light.castShadow = true;
    scene.add(light);

    //Ground
    const geo = new THREE.PlaneBufferGeometry(500, 500, 1, 1);
    const mat = new THREE.MeshPhongMaterial({color:"whitesmoke"});
    const mesh = new THREE.Mesh(geo,mat);
    mesh.rotation.x = -Math.PI/2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const loader = new FBXLoader();
    loader.load("excavator.fbx", loadDone);

    //rutenett
    const grid = new THREE.GridHelper(500, 100, "#000000", "#ff0100");
    scene.add(grid);

    //renderer
    const rendererAttrib = {antialias: true, canvas: aCanvas};
    renderer = new THREE.WebGLRenderer(rendererAttrib);
    renderer.setPixelRatio(window.innerWidth / window.innerHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    //Orbit kontroller, for å navigere med mus
    const orbCtrl = new OrbitControls(cam,renderer.domElement);
    orbCtrl.target.set(0,0,0);
    orbCtrl.update();

    const datGUI = new dat.GUI();
    Link001 = datGUI.addFolder("Rotasjon maskinhus, Link 1");
    Link001.open();
    Link002 = datGUI.addFolder("Link 2");
    Link002.open();
    Link003 = datGUI.addFolder("Link 3");
    Link003.open();
    Link004 = datGUI.addFolder("Rotasjon Gripearm, Link 4");
    Link004.open();
    Skuff001 = datGUI.addFolder("Skuff, Link 1");
    Skuff001.open();
    Skuff002 = datGUI.addFolder("Skuff, Link 2");
    Skuff002.open();
    requestAnimationFrame(render);
}//init

    function loadDone(aObject){
        aObject.traverse(loadChild);
        scene.add(aObject);
        importedObjects = aObject;
        if(importedObjects){
            console.log(importedObjects);
            Link004.add(importedObjects.children[0].children[34].children[13].children[11].rotation,"y",-0.558,0.858,0.001);
            Link004.add(importedObjects.children[0].children[34].children[13].children[11].rotation,"x",-0.558,0.558,0.001);
            Link003.add(importedObjects.children[0].children[34].children[13].rotation,"y",-0.7,1,0.001);
            Link002.add(importedObjects.children[0].children[34].rotation,"y",-0.5,0.2,0.001);
            Link001.add(importedObjects.children[0].rotation,"z",-Math.PI,Math.PI,0.001);
            Skuff001.add(importedObjects.children[2].children[0].rotation,"y",-0.5,0.5,0.001);
            Skuff002.add(importedObjects.children[2].rotation,"y",-0.5,0.6,0.001);
        }
    }//loadDone

    function loadChild(aChild){
        if(aChild.isMesh){
            aChild.castShadow = true;
            aChild.recieveShadow = true;
        }
    }

    function render() {
        renderer.render(scene, cam);
        requestAnimationFrame(render);
    }