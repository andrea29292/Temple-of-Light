

/* global doorLight, Porta_Chiusa, light, Porta1, THREE, wall_material, faro, PortaO, PortaS, PortaN, PortaE, scene */
var torch_y = 3.5;
var torch_distance = 0.6;
function pointLightGenerator(x,z) {
    var pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(x, torch_y, z);
    pointLight.distance = 0;
    pointLight.intensity = 0.2;
    scene.add(pointLight);

    lightSource(pointLight);
    
    spotLightGenerator(pointLight,Porta_Chiusa);
    
    
}

function spotLightGenerator(origin,target){
    
    var pointColor = "#ffffff";
    var spotLight = new THREE.SpotLight(pointColor);
    spotLight.position.set(origin.position.x,origin.position.y,origin.position.z);
    spotLight.castShadow = true
    spotLight.shadowCameraNear = 0.01
    spotLight.shadowCameraFar = 6
    spotLight.shadowCameraFov = 10
    spotLight.shadowCameraLeft = -2
    spotLight.shadowCameraRight = 2
    spotLight.shadowCameraTop = 1
    spotLight.shadowCameraBottom = -1
    spotLight.shadowBias = 0.0
    spotLight.shadowDarkness = 0.5
    spotLight.shadowMapWidth = 1024
    spotLight.shadowMapHeight = 1024


    spotLight.shadowCameraVisible = true;
    spotLight.distance = 0;

    spotLight.target = target;
    scene.add(spotLight);    
    lightSource(spotLight);
}

function spotLightDoor() {

    // LUCI
    var pointColor = "#ffffff";
    doorLight = new THREE.SpotLight(pointColor);
    doorLight.position.set(faro.position.x,faro.position.y+1.25,faro.position.z+0.05);
    doorLight.castShadow = true
    doorLight.shadowCameraNear = 0.01
    doorLight.shadowCameraFar = 6
    doorLight.shadowCameraFov = 10
    doorLight.shadowCameraLeft = -2
    doorLight.shadowCameraRight = 2
    doorLight.shadowCameraTop = 1
    doorLight.shadowCameraBottom = -1
    doorLight.shadowBias = 0.0
    doorLight.shadowDarkness = 0.5
    doorLight.shadowMapWidth = 1024
    doorLight.shadowMapHeight = 1024


    doorLight.shadowCameraVisible = true;
    doorLight.distance = 10;

    doorLight.target = Porta_Chiusa;
    scene.add(doorLight);
    ////////////


    //////////////////////////////////////////////////////////////////////////////////
    //		add a volumetric spotligth					//
    //////////////////////////////////////////////////////////////////////////////////

    // add spot light
    var geometry = new THREE.CylinderGeometry(0.16, 1, 4.5, 32 * 2, 20, true);

    var material = new THREEx.VolumetricSpotLightMaterial();
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(doorLight.position.x - (geometry.parameters.height / 2)-0.26, doorLight.position.y-0.08, doorLight.position.z-0.125);
    mesh.lookAt(new THREE.Vector3(doorLight.target.position.x, 100, doorLight.target.position.z));
    material.uniforms.lightColor.value.set('white');
    material.uniforms.spotPosition.value = mesh.position;
    material.uniforms['anglePower'].value = 0;
    material.uniforms['attenuation'].value = 10;
    //0.9 2.5 
    //material.uniforms.lightColor.value.set(options.lightColor);
    //mesh.position.set(11, 4, 8.64);
    scene.add(mesh);


    lightSource(doorLight);

    


    // SFERA DI PROVA//////////
    var sphereGeometryT = new THREE.SphereGeometry(0.25, 20, 20);
    sphereGeometryT.computeTangents(); 
    var sphereT = new THREE.Mesh(sphereGeometryT, this.wall_material);
    sphereT.position.x = doorLight.position.x - 4;
    sphereT.position.y = doorLight.position.y - 1;
    sphereT.position.z = doorLight.position.z;
    
    sphereT.castShadow = true;
    sphereT.receiveShadow = true;
    scene.add(sphereT);
    ////////////////////
}

function computeShadow(object){
    object.receiveShadow = true;
    object.castShadow = true;
}

function torchLight(){
    // PIAZZAMENTO LUCI TORCE PORTA NORD
    pointLightGenerator(PortaN.position.x, PortaN.position.z - torch_distance);
    pointLightGenerator(PortaN.position.x + 1.82 + 1.59, PortaN.position.z - torch_distance);
    pointLightGenerator(PortaN.position.x, PortaN.position.z + torch_distance);
    pointLightGenerator(PortaN.position.x + 1.82 + 1.59, PortaN.position.z + torch_distance);
    
     // PIAZZAMENTO LUCI TORCE PORTA EST
    pointLightGenerator(PortaE.position.x - torch_distance, PortaE.position.z);
    pointLightGenerator(PortaE.position.x - torch_distance, PortaE.position.z + (1.82 + 1.59));
    pointLightGenerator(PortaE.position.x + torch_distance, PortaE.position.z);
    pointLightGenerator(PortaE.position.x + torch_distance, PortaE.position.z + (1.82 + 1.59));
    
    // PIAZZAMENTO LUCI TORCE PORTA OVEST
    pointLightGenerator(PortaO.position.x - torch_distance, PortaO.position.z);
    pointLightGenerator(PortaO.position.x - torch_distance, PortaO.position.z + (1.82 + 1.59));
    pointLightGenerator(PortaO.position.x + torch_distance, PortaO.position.z);
    pointLightGenerator(PortaO.position.x + torch_distance, PortaO.position.z + (1.82 + 1.59));
    
    // PIAZZAMENTO LUCI TORCE PORTA SUD
    pointLightGenerator(PortaS.position.x, PortaS.position.z - torch_distance);
    pointLightGenerator(PortaS.position.x + 1.82 + 1.59, PortaS.position.z - torch_distance);
}

function orientate_cone() {
    //calcolo dell'orientamento del cilindro
    //cateto dell'altezza 
    var c = Math.abs(doorLight.target.position.y - light_cone.position.y);
    //alert(c);
    //teorema di pitagora per calcolare l'altro cateto
    var b = Math.sqrt(
            Math.pow(Math.abs(((doorLight.position.x) - (doorLight.target.position.x))), 2) +
            Math.pow(Math.abs((doorLight.position.z - doorLight.target.position.z)), 2));
    //alert(b);
    //calcolo rotazione lungo asse xs
    var alfa = Math.atan((c / b));
    //alert(alfa);
    light_cone.rotation.z = +alfa - Math.PI / 2;
    //light_cone.rotation.x = 120;
    //light_cone.rotation.z = -Math.PI/2;

    //Devo spostare il cono in avanti e in alto/basso per farlo corrispondere al fascio di luce
    light_cone.position.x = light_cone.position.x - (cylinder.parameters.height / 2);

    //calcolo la differenza sulle y e sulle x tra la luce e il target
    var a = Math.abs(light_cone.position.y - doorLight.target.position.y);
    var b = Math.abs(light_cone.position.x - doorLight.target.position.x);
    //con una proporzione determino l'altezza del cono
    var new_y = (a * (cylinder.parameters.height / 2)) / b;

    light_cone.position.y = doorLight.position.y - new_y;

}

function lightSource(source){
    // LIGHT SOURCE SPHERE //////////////////
    var sphereGeometry = new THREE.SphereGeometry(0.3, 20, 20);
    var darkMaterial = new THREE.MeshBasicMaterial({color: 0x000000});

    var wireframeMaterial = new THREE.MeshBasicMaterial(
            {color: 0x00ff00, wireframe: true, transparent: true});
    var sphere = THREE.SceneUtils.createMultiMaterialObject(
            sphereGeometry, [darkMaterial, wireframeMaterial]);
    sphere.position.x = source.position.x;
    sphere.position.y = source.position.y;
    sphere.position.z = source.position.z;
    scene.add(sphere);
}