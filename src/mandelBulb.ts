import { map } from './range';
import {
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  Vector3,
  Spherical,
} from 'three';

export const getMandelBulb = ({
  dim = 128,
  scale = 100,
  n = 16,
  maxIter = 20,
  color = 0xffffff,
}) => {
  const points: number[] = [];
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      let edge = false;
      for (let k = 0; k < dim; k++) {
        const x = map(i, 0, dim, -1, 1);
        const y = map(j, 0, dim, -1, 1);
        const z = map(k, 0, dim, -1, 1);

        const zeta = new Vector3(0, 0, 0);
        const s = new Spherical();
        for (let iter = 0; iter <= maxIter; iter++) {
          s.setFromVector3(zeta);
          const powRadius = Math.pow(s.radius, n);
          const sinTheta = Math.sin(s.theta * n);
          const cosTheta = Math.cos(s.theta * n);
          const sinPhi = Math.sin(s.phi * n);
          const cosPhi = Math.cos(s.phi * n);

          zeta.x = powRadius * sinTheta * cosPhi + x;
          zeta.y = powRadius * sinTheta * sinPhi + y;
          zeta.z = powRadius * cosTheta + z;

          if (s.radius > 16) {
            if (edge) {
              edge = false;
            }
            break;
          }
          if (iter === maxIter) {
            if (!edge) {
              edge = true;
              points.push(zeta.x * scale, zeta.y * scale, zeta.z * scale);
            }
            break;
          }
        }
      }
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3));
  const material = new PointsMaterial({ size: 1, color });
  return new Points(geometry, material);
};
