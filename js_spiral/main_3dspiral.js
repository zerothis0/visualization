import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js' 
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'; // TextBufferGeometry 임포트


import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

const w = window.innerWidth;
const h = window.innerHeight;
const aspect = w / h

const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
let camZoom = 24
const camera = new THREE.OrthographicCamera(
    -aspect * camZoom, // left
    aspect * camZoom, // right
    camZoom, // top
    -camZoom, // bottom
    1, // near
    1000000 // far
);
// camera.up.set(0, 0, 1)
camera.lookAt(new THREE.Vector3(0, 0, 0));
camera.position.z = 100;
camera.position.x = 0;
camera.position.y = 0;
const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

let data
async function loadJSON() {
    // JSON 파일을 fetch로 비동기적으로 요청
    const response = await fetch('spiral.json');
    
    // 파일을 JSON으로 파싱
    data = await response.json();
}



// 함수 호출
await loadJSON();


// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

// YELLOW = (202/255.,183/255.,24/255.)
// GREEN = (0., 176/255., 0.)
const dl = 10
const circleXY = [];
for (let i = 0 + 8; i <= 360-8; i++) {
    circleXY.push([(dl + 7.5) * Math.cos(2 * Math.PI * (i / 360) + Math.PI/2) , 
        (dl + 7.5) * Math.sin(Math.PI/2. + 2 * Math.PI * (i / 360))]);
}

const lineGeometry = new THREE.BufferGeometry();
const circlePositions = [];

circleXY.forEach(p => {
    circlePositions.push(p[0], p[1], 30);  // x, y, z coordinates for the circle
});

lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(circlePositions, 3));

const colorVector = new THREE.Color(202/255.,183/255.,24/255.);  // White color
const lineMaterial = new THREE.LineBasicMaterial({
    color: colorVector,
    linewidth: 1, // Thickness of the line
    transparent: false,
    opacity: 1.0
});

const circleLine = new THREE.Line(lineGeometry, lineMaterial);
scene.add(circleLine);

const circleXY2 = [];
for (let i = 0 + 12; i <= 360-12; i++) {
    circleXY2.push([(dl) * Math.cos(Math.PI/2. + 2 * Math.PI * (i / 360)), (dl) * Math.sin(Math.PI/2. + 2 * Math.PI * (i / 360))]);
}

const lineGeometry2 = new THREE.BufferGeometry();
const circlePositions2 = [];

circleXY2.forEach(p => {
    circlePositions2.push(p[0], p[1], 30);  // x, y, z coordinates for the circle
});

lineGeometry2.setAttribute('position', new THREE.Float32BufferAttribute(circlePositions2, 3));

const colorVector2 = new THREE.Color(0., 176/255., 0.);  // White color
const lineMaterial2 = new THREE.LineBasicMaterial({
    color: colorVector2,
    linewidth: 1, // Thickness of the line
    transparent: false,
    opacity: 1.0
});

const circleLine2 = new THREE.Line(lineGeometry2, lineMaterial2);
scene.add(circleLine2);

const circleXY3 = [];
for (let i = 0 + 20; i <= 360-20; i++) {
    circleXY3.push([(dl - 4) * Math.cos(Math.PI/2.+ 2 * Math.PI * (i / 360)), (dl - 4) * Math.sin(Math.PI/2. + 2 * Math.PI * (i / 360))]);
}

const lineGeometry3 = new THREE.BufferGeometry();
const circlePositions3 = [];

circleXY3.forEach(p => {
    circlePositions3.push(p[0], p[1], 30);  // x, y, z coordinates for the circle
});

lineGeometry3.setAttribute('position', new THREE.Float32BufferAttribute(circlePositions3, 3));

const colorVector3 = new THREE.Color(202/255.,183/255.,24/255.);  // White color
const lineMaterial3 = new THREE.LineBasicMaterial({
    color: colorVector3,
    linewidth: 1, // Thickness of the line
    transparent: false,
    opacity: 1.0
});



const circleLine3 = new THREE.Line(lineGeometry3, lineMaterial3);
scene.add(circleLine3);






const spiralRaw1 = data['r']
const spiralRaw2 = data['r2']
const degrees1 = data['deg']
const degrees2 = data['deg2']
const zlevel1 = data['zlevel']
const zlevel2 = data['zlevel2']
const yearText = data['yearText']
const yearValue = data['yearValue']





function interpolatePoints(lineData, desiredDistance, zlevel) {
    const originalPoints = [];
    lineData.forEach((coord, i) => {
        const lat = coord[0];
        const lon = coord[1];
        originalPoints.push(new THREE.Vector3(lat, lon, zlevel[i]));  // Using THREE.Vector3 for 3D points
    });

    const interpolatedPoints = [];

    for (let i = 0; i < originalPoints.length - 1; i++) {
        const startPoint = originalPoints[i];
        const endPoint = originalPoints[i + 1];
        const segmentDirection = endPoint.clone().sub(startPoint);
        const segmentLength = segmentDirection.length();
        segmentDirection.normalize();  // Normalize direction vector

        // Add the start point
        interpolatedPoints.push(startPoint.clone());

        // Interpolate intermediate points
        let distanceCovered = 0;
        while (distanceCovered + desiredDistance < segmentLength) {
            distanceCovered += desiredDistance;
            const newPoint = startPoint.clone().add(segmentDirection.clone().multiplyScalar(distanceCovered));
            interpolatedPoints.push(newPoint);
        }
    }

    // Add the last point
    interpolatedPoints.push(originalPoints[originalPoints.length - 1].clone());

    return interpolatedPoints;
}

const spiralXY1 = []
spiralRaw1.forEach((p,i ) => {
    spiralXY1.push([ (p + dl) * Math.cos(degrees1[i]), (p +dl) * Math.sin(degrees1[i])])
})
const spiralXY2 = []
spiralRaw2.forEach((p,i ) => {
    spiralXY2.push([ (p + dl) * Math.cos(degrees2[i]), (p +dl) * Math.sin(degrees2[i])])
})

const spiralInter1 = interpolatePoints(spiralXY1, 0.05, zlevel1)
const spiralInter2 = interpolatePoints(spiralXY2, 0.05, zlevel2)

const spiralInter = spiralInter1.concat(spiralInter2)
// const spiralRaw = spiralRaw1.concat(spiralRaw2)
// const degrees = degrees1.concat(degrees2)
// const zlevel = zlevel1.concat(zlevel2)

function normalize(value, min, max) {
    return (value - min) / (max - min);
}

// coolwarm 색상 맵 함수 (파랑 -> 빨강)

const refC = 0.55
function coolwarm(value) {
    const t = Math.max(0, Math.min(1, value));  // 0과 1 사이로 클램핑
    
    let r, g, b;

    if (t < 0.430) {
        // t가 0에서 0.45로 증가할 때, 파랑 -> 연파랑으로 변환
        r = t / refC;
        g = t / refC;
        b = 1;
    } else if (t < 0.45) {
        // t가 0.45에서 0.55 사이일 때 흰색
        r = 1;
        g = 1;
        b = 1;
    } else {
        // t가 0.55에서 1로 증가할 때, 연한 빨강 -> 빨강으로 변환
        r = 1;
        g = (1 - t) / refC;
        b = (1 - t) / refC;
    }

    return [r, g, b];
}

let minValue = 999
let maxValue = -999

// 각 값에 대해 RGB 색상 값 계산
let normalizedValues = spiralInter.map(value => {
    const normValue = normalize(Math.sqrt((value.x *value.x) + (value.y * value.y)) - Math.sqrt(200), -10, 3.2);  // -30 ~ 30을 0 ~ 1로 정규화
    if (normValue < minValue) {
        minValue = normValue
    }
    if (normValue > maxValue) {
        maxValue = normValue
    }
    // console.log(normValue)
    return coolwarm(normValue);  // coolwarm 색상 맵 함수 적용
});

const textMeshes = []
const yearTextMeshes = []
let yearTextMesh
const texts = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const degColor = [ new THREE.Color(202/255.,183/255.,24/255.), new THREE.Color(0., 176/255., 0.), new THREE.Color(202/255.,183/255.,24/255.)]
// 텍스트 추가
const loader = new FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const geometry = new TextGeometry(yearText[0].toString(), {
        font: font,
        size: 2.3,
        depth: 2,
    });
    geometry.computeBoundingBox(); // bounding box 계산
    const boundingBox1 = geometry.boundingBox;
    const center1 = new THREE.Vector3();
    boundingBox1.getCenter(center1); // bounding box의 중심 계산
    // geometry.translate(-center1.x, -center1.y, -center1.z);
    // console.log(center1.x, center1.y)

    
    // 텍스트에 색상 및 재질 추가
    const material = new THREE.MeshBasicMaterial({ color: coolwarm(normalize(yearValue[0])) });
    yearTextMesh = new THREE.Mesh(geometry, material);
    
    // 텍스트 위치 설정

    yearTextMesh.position.set(-3.826049968600273,-1.1005499623715878, 50);

    // 텍스트 씬에 추가
    scene.add(yearTextMesh);
    yearTextMeshes.push(yearTextMesh)



    // 텍스트 메시지 생성
    texts.forEach((text, i) => {
        const geometry = new TextGeometry(texts[i], {
            font: font,
            size: 1,
            depth: 2,
        });

        geometry.computeBoundingBox(); // bounding box 계산
        const boundingBox1 = geometry.boundingBox;
        const center1 = new THREE.Vector3();
        boundingBox1.getCenter(center1); // bounding box의 중심 계산
    
        // 텍스트의 중심을 원점으로 이동
        geometry.translate(-center1.x, -center1.y, -center1.z);
    
        // 텍스트에 색상 및 재질 추가
        const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(202/255.,183/255.,24/255.) });
        const textMesh = new THREE.Mesh(geometry, material);
        
        // 텍스트 위치 설정
        const x = (dl + 9.3 ) * Math.cos(Math.PI/2. - i * Math.PI / 6.)
        const y = (dl + 9.3 ) * Math.sin(Math.PI/2. - i * Math.PI / 6.)
        textMesh.position.set(x, y, 50);
    
        // 텍스트 씬에 추가
        scene.add(textMesh);
        textMeshes.push(textMesh)
    })
});

const textDegMeshes = []
const ellMeshes = []
const degTexts = ['+7.5°C', '0°C', '-4°C']
const degY = [7.5, 0, -4]
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    degTexts.forEach((text, i) => {
        const ellipseGeometry = new THREE.CircleGeometry(1.0, 32); // 반지름 5의 원형 기하학
        const ellipseMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity:0.5 }); // 검은색 재질
        const ellipseMesh = new THREE.Mesh(ellipseGeometry, ellipseMaterial);

        // 타원형 크기 조정 (타원형으로 만들기)
        ellipseMesh.scale.set(2, 1, 1); // x축 2배, y축 1배로 타원형으로 조정
        ellipseMesh.position.set(0, dl + degY[i] , 48); // 텍스트 뒤에 위치
        scene.add(ellipseMesh);
        ellMeshes.push(ellipseMesh)
    
        // 첫 번째 텍스트 메시지 생성
        const geometry1 = new TextGeometry(text, {
            font: font,
            size: 1,
            depth: 2,
        });
        
        // bounding box 계산
        geometry1.computeBoundingBox(); // bounding box 계산
        const boundingBox1 = geometry1.boundingBox;
        const center1 = new THREE.Vector3();
        boundingBox1.getCenter(center1); // bounding box의 중심 계산
    
        // 텍스트의 중심을 원점으로 이동
        geometry1.translate(-center1.x, -center1.y, -center1.z);
    
        const material1 = new THREE.MeshBasicMaterial({ color: degColor[i] });
        const textMesh1 = new THREE.Mesh(geometry1, material1);
        textMesh1.position.set(0, dl + degY[i], 50); // 타원형과 중앙 맞추기
        scene.add(textMesh1);
        textDegMeshes.push(textMesh1);  // 배열에 저장
    })


})





const aniMax = spiralInter.length

const positionArray = [];
const geometryArray = [];
const colorArray = [];
const planeArray = [];

const max = spiralInter.length;
const positions = new Float32Array(max * 3);
const colors = new Float32Array(max * 3);
const opacity = new Float32Array(max);
const geometryLine = new THREE.BufferGeometry();

for (let j=0; j < max; j++) {
    opacity.set([0], j);
    positions.set([-9999, -9999, -9999], j*3)
    colors.set([1, 0, 0], j*3)
}

geometryLine.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometryLine.setAttribute("opacity", new THREE.BufferAttribute(opacity, 1));
geometryLine.setAttribute("color", new THREE.BufferAttribute(colors, 3));
let colorIdxArray = new Float32Array(max); // 각 포인트의 색상 인덱스
for (let j = 0; j < max; j++) {
    colorIdxArray[j] = j / max; // 각 점의 인덱스를 색상 보간 값으로 설정
}
geometryLine.setAttribute('colorIdx', new THREE.BufferAttribute(colorIdxArray, 1));

const materialLine = new THREE.ShaderMaterial({
    extensions: {
        derivatives: "#extension GL_OES_standard_derivatives: enable"
    },
    side: THREE.DoubleSide,
    uniforms:{
        time: {value: 0},
        resolution: {value: new THREE.Vector4()},
        lineColor: { value: new THREE.Color(1,1,1)},
        size: {value: 3},
        opacity: {value: 1}
    },
    transparent: true,
    depthTest: true,
    depthWrite: true,
    vertexShader: `
    uniform float time;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying float vOpacity;
    attribute float opacity;
    uniform float size;
    varying vec3 vColor;  // Pass color to fragment shader
    attribute vec3 color;  // Receive color attribute
    varying float vColorIdx;
    attribute float colorIdx;

    void main() {
        vColorIdx = colorIdx;
        vUv = uv;
        vColor = color;  // Assign color attribute to varying

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
        gl_PointSize = size * (1. );
        gl_Position = projectionMatrix * mvPosition;
    }
    `,
    fragmentShader: `
        uniform float time;
        uniform sampler2D texture1;
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform vec3 lineColor;
        uniform float opacity;
        varying vec3 vColor;  // Receive color from vertex shader
        varying float vColorIdx;



        void main() {
            vec2 uv = vec2(gl_PointCoord.x, 1. - gl_PointCoord.y);
            float radius = length(uv - vec2(0.5));
            if (radius > 0.5) discard;
            vec3 color = mix(vColor, lineColor, vColorIdx);

            gl_FragColor = vec4(color, opacity);
        }
    `
});
const font = await new FontLoader().loadAsync('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json');

function updateYearText(newText, textIdx) {
    if (yearTextMesh) {
        scene.remove(yearTextMesh); // Remove old text

        // Create new geometry and update textMesh
        const newGeometry = new TextGeometry(newText, {
            font: font, // Use the same font
            size: 2.3,
            depth: 1
        });
        yearTextMesh.material.color.set(coolwarm(normalize(yearValue[textIdx])))
        yearTextMesh.geometry.dispose(); // Clean up old geometry
        yearTextMesh.geometry = newGeometry;


        scene.add(yearTextMesh); // Add updated mesh
    }
}

const planeLine = new THREE.Points(geometryLine, materialLine);
planeLine.frustumCulled = false;

scene.add(planeLine);

positionArray.push(positions);
geometryArray.push(geometryLine);
planeArray.push(planeLine);
colorArray.push(colors)
let logUpstair = true

let dcount = 100
let count = 0
let idx = 0
let countHighlight = 500;
let prevYear = yearText[0].toString()
function upstair() {
    
    for (let j=count; j < Math.min(aniMax, count + dcount); j++) {
        idx = Math.floor(j)
        let p = spiralInter[idx]
        positionArray[0].set([p.x, p.y, p.z], idx*3)
        colorArray[0].set(normalizedValues[idx], idx * 3);
        const textIdx = Math.floor(p.z/0.2)
        if (yearText[textIdx].toString() != prevYear) {
            updateYearText(yearText[textIdx].toString(), textIdx)
            prevYear = yearText[textIdx]
        }
        // if (yearTextMeshes[0].text != yearText[textIdx].toString()) {
        //     yearTextMeshes[0].text = yearText[textIdx].toString()
        // }
    }  
    
    for (let j=Math.max(0, count - countHighlight); j <= count + dcount; j++) {
        idx = Math.floor(j)
        geometryArray[0].attributes.colorIdx.setX(idx, (j- count + countHighlight)/ (countHighlight + dcount)); 
    } 
    for (let j= Math.max(0, count- countHighlight) ; j > Math.max(0, count - 2* Math.max(countHighlight, dcount)); j-- ) {
        idx = Math.floor(j)
        geometryArray[0].attributes.colorIdx.setX(idx, 0); 
    }

    geometryArray[0].attributes.position.needsUpdate = true;
    geometryArray[0].attributes.color.needsUpdate = true;
    geometryArray[0].attributes.colorIdx.needsUpdate = true;

    count += dcount
    if (count >= aniMax + Math.max(dcount, countHighlight)) {
        logUpstair = false
        scene.remove(circleLine);
        scene.remove(circleLine2);
        scene.remove(circleLine3);
        for (let k=0; k < textMeshes.length; k++) {
            scene.remove(textMeshes[k])
        }
        for (let k=0; k < textDegMeshes.length; k++) {
            scene.remove(textDegMeshes[k])
            scene.remove(ellMeshes[k])
        }
        scene.remove(yearTextMesh)

    }
}
let radius = 100;  // The distance from the origin
let angle = 0;    // Start angle
let moveZ
function moveCamera() {
    moveZ = (angle * 2 / Math.PI) * 15
    camera.position.z = radius * Math.cos(angle) + moveZ;
    camera.position.y = -radius * Math.sin(angle); // Set the z-value (fixed in this example)

    // Make the camera look at the origin (0, 0, 0)
    camera.lookAt(new THREE.Vector3(0, 0, moveZ));

    // Update the angle for rotation
    angle += 0.01; // Speed of the orbit
    angle = Math.min(Math.PI / 2, angle)
    // camera.lookAt(0,0,0)
    if (logVert && (angle == Math.PI /2)) {
        allVert()
    }
}

function rotVert(angle) {
    const dx = camera.position.x /5
    const dy = camera.position.y /5
    const ll = [dl, -dl, dl+7.5, -dl-7.5]
    const angleVert = -angle - Math.PI /2
    vertPosition.forEach((vert, i) =>{
        vert.set([ll[i] * Math.cos(angleVert) +dx, ll[i] * Math.sin(angleVert) + dy, 0, 
            ll[i] * Math.cos(angleVert) + dx, ll[i] * Math.sin(angleVert) + dy, vertZPos], 0);
        vertGeometry[i].attributes.position.array = vert; // 업데이트된 배열 설정
        vertGeometry[i].attributes.position.needsUpdate = true;
    })

}

camera.up.set(0, 0, 1)
function rotCamera() {
    // camera.position.z = 0;
    camera.position.x = radius * Math.cos(-angle);
    camera.position.y = radius * Math.sin(-angle); // Set the z-value (fixed in this example)
    camera.lookAt(new THREE.Vector3(0, 0, moveZ));
    rotVert(angle)
    angle += 0.01

}

const vertZPos = 25
const vertLines = []
let logVert = true

function createStyledDiv(text, topPercentage, leftPercentage, color) {
    const newDiv = document.createElement("div");
    newDiv.innerHTML = `${text}`;

    // 스타일 추가: 절대 위치와 비율로 배치
    newDiv.style.position = "absolute";  // 화면 기준으로 절대 위치
    newDiv.style.top = topPercentage;    // 화면의 지정된 비율 아래
    newDiv.style.left = leftPercentage;  // 화면의 지정된 비율 지점에 수평 위치
    newDiv.style.transform = "translate(-50%, -50%)"; // 가운데 정렬 보정

    // 스타일 추가: 텍스트 및 배경 설정
    newDiv.style.backgroundColor = "rgba(1, 1, 1, 0.5)";  // 기본 색상 설정
    newDiv.style.color = color;
    newDiv.style.padding = "1px";
    newDiv.style.borderRadius = "7px";
    newDiv.style.fontSize = "20px"

    // 문서에 추가
    document.body.appendChild(newDiv);
}

const decadeText = ['1910', '1920', '1930', '1940', '1950', '1960', '1970', '1980', '1990', '2000', '2010', '2020']
function allVert(){
    vertLine([dl, -10, 0, dl, -10, vertZPos], new THREE.Color(0., 176/255., 0.))
    vertLine([-dl, -10, 0, -dl, -10, vertZPos], new THREE.Color(0., 176/255., 0.))
    vertLine([dl + 7.5, -10, 0, dl + 7.5, -10, vertZPos], new THREE.Color(202/255.,183/255.,24/255.))
    vertLine([-dl - 7.5, -10, 0, -dl-7.5, -10, vertZPos], new THREE.Color(202/255.,183/255.,24/255.))

    // vertLine([-100, -100, 0.5, 100, 100, 0.5], new THREE.Color(0., 176/255., 0.))
    // vertLine([-100, -100, 2.5, 100, 100, 2.5], new THREE.Color(0., 176/255., 0.))
    // vertLine([-100, -100, 4.5, 100, 100, 4.5], new THREE.Color(0., 176/255., 0.))
    // vertLine([-100, -100, 6.5, 100, 100, 6.5], new THREE.Color(0., 176/255., 0.))
    // vertLine([-100, -100, 8.5, 100, 100, 8.5], new THREE.Color(0., 176/255., 0.))
    // vertLine([-100, -100, 10.5, 100, 100, 10.5], new THREE.Color(0., 176/255., 0.))
    // vertLine([-100, -100, 12.5, 100, 100, 12.5], new THREE.Color(0., 176/255., 0.))
    // vertLine([-100, -100, 14.5, 100, 100, 14.5], new THREE.Color(0., 176/255., 0.))
    // vertLine([-100, -100, 16.5, 100, 100, 16.5], new THREE.Color(0., 176/255., 0.))
    // vertLine([-100, -100, 18.5, 100, 100, 18.5], new THREE.Color(0., 176/255., 0.))
    // vertLine([-100, -100, 20.5, 100, 100, 20.5], new THREE.Color(0., 176/255., 0.))
    // vertLine([-100, -100, 22.5, 100, 100, 22.5], new THREE.Color(0., 176/255., 0.))
    // vertLine([-100, -100, 23.1, 100, 100, 23.1], new THREE.Color(0., 176/255., 0.))
    // createStyledDiv("Korean War", "64%", "50%", "rgba(0, 176, 0, 0.9)");
    decadeText.forEach( (text, i) => {
        createStyledDiv(text, `${80 - i*4.1}%`, "50%", "rgba(0, 176, 0, 0.9)")
        if (text == '1950') {
            createStyledDiv("Korean War", `${80 - i*4.1 - 0.3}%`, "56%", "white")
        }
    })
    createStyledDiv('2023', "32.0%", "50%", "rgba(0, 176, 0, 0.9)")
    //'+7.5°C', '0°C'
    createStyledDiv("+7.5°C", "28%", "29%", "rgba(202, 183, 24, 0.9)")
    createStyledDiv("+7.5°C", "28%", "71%", "rgba(202, 183, 24, 0.9)")
    createStyledDiv("0°C", "28%", "38%", "rgba(0, 176, 0, 0.9)")
    createStyledDiv("0°C", "28%", "62%", "rgba(0, 176, 0, 0.9)")



    logVert = false

}

const vertPosition = []
const vertGeometry = []

function vertLine(p, color){
    const lineGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(6); // 2 points * 3 coordinates (x, y, z)
    positions.set([p[0], p[1], p[2], p[3], p[4], p[5]]);


    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const colorVector = color;  // White color
    const lineMaterial = new THREE.LineBasicMaterial({
        color: colorVector,
        linewidth: 5, // Thickness of the line
        transparent: false,
        opacity: 1.0
    });


    const circleLine = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(circleLine);
    vertLines.push(circleLine)
    vertPosition.push(positions)
    vertGeometry.push(lineGeometry)
}


function animate() {
    requestAnimationFrame(animate)
    if (logUpstair) {
        upstair()
    } else {
        if (logVert) {
            moveCamera()
        } else {
            rotCamera()
        }
    }
    renderer.render(scene, camera);
}

animate();