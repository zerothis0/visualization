import * as THREE from 'three';
import { OrbitControls} from 'three/addons/controls/OrbitControls.js';


// Scene, Camera, Renderer 생성
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update()

const point1 = new THREE.Vector3(-2, -2, 0); // 첫 번째 점
const point2 = new THREE.Vector3(2, 2, 0); // 두 번째 점

// 선을 정의할 점들을 설정합니다
const points = [point1]; // 선의 초기 점 (시작점)
const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 }); // 선의 색상 설정
const line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);

// 애니메이션 변수
let progress = 0;
const speed = 0.001; // 선이 그려지는 속도

function drawLineBetweenPoints(p1, p2, duration = 2) {
  const points = [p1, p1]; // 초기 점 (시작점만 포함)
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 }); // 선의 색상 설정
  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);

  let progress = 0;
  const speed = 1 / (60 * duration); // 초당 프레임 수 기준으로 속도 설정

  function animate() {
      requestAnimationFrame(animate);

      if (progress < 1) {
          progress += speed; // 진행 상황 업데이트

          // 두 점 사이의 보간 점 계산
          const x = p1.x + (p2.x - p1.x) * progress;
          const y = p1.y + (p2.y - p1.y) * progress;
          const newPoint = new THREE.Vector3(x, y, 0);

          // 선의 점 업데이트
          points[1] = newPoint;
          lineGeometry.setFromPoints(points);
      }

      renderer.render(scene, camera);
  }
}

// 카메라 위치 설정
camera.position.z = 10;

// 애니메이션 루프 함수
function animate() {
    requestAnimationFrame(animate);
    if (progress < 1) {
      progress += speed; // 진행 상황 업데이트

      // 두 점 사이의 보간 점 계산
      const x = point1.x + (point2.x - point1.x) * progress;
      const y = point1.y + (point2.y - point1.y) * progress;
      const newPoint = new THREE.Vector3(x, y, 0);

      // 선의 점 추가
      points.push(newPoint);
      console.log(points.length)
      lineGeometry.setFromPoints(points);
  }


    controls.update()

    renderer.render(scene, camera);
}

animate();

// 화면 크기 변경 대응
window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

