const BIGGER = 4;
const WIDE = 280*BIGGER;
const HIGH = 192*BIGGER;
const SCALE = 100*BIGGER;
const XOFF = WIDE/2;
const YOFF = HIGH/2;
const F = 4;

let vertices = [];
let facets = [];
let rotated = [];

let Xang = 0;
let Yang = 0;
let Zang = 0;


function setup() {
  createCanvas(WIDE, HIGH);
  strokeWeight(1);
  fill(40);
  stroke("green");
  loadObject();
}

function draw() {
  background(0);
  rotateObject();
  let x0, y0, z0, x1, y1, z1, x2, y2, z2;
  let x0p, y0p, x1p, y1p, x2p, y2p;
  
  for(let i=0; i<facets.length; ++i) {
    x0 = rotated[facets[i][0]-1][0];
    y0 = rotated[facets[i][0]-1][1];
    z0 = rotated[facets[i][0]-1][2];
    x0p = F*x0/(F-z0);
    y0p = F*y0/(F-z0);
    
    x1 = rotated[facets[i][1]-1][0];
    y1 = rotated[facets[i][1]-1][1];
    z1 = rotated[facets[i][1]-1][2];
    x1p = F*x1/(F-z1);
    y1p = F*y1/(F-z1);
    
    x2 = rotated[facets[i][2]-1][0];
    y2 = rotated[facets[i][2]-1][1];
    z2 = rotated[facets[i][2]-1][2];
    x2p = F*x2/(F-z2);
    y2p = F*y2/(F-z2);
    
    // Only display when Facet Normal Z is Positive (Facing Forward)
    nml = calcNormal(x0p,y0p,z0, x1p,y1p,z1, x2p,y2p,z2);

    if (nml[2] > 0) {
      triangle(x0p*SCALE+XOFF, y0p*SCALE+YOFF, x1p*SCALE+XOFF, y1p*SCALE+YOFF, x2p*SCALE+XOFF, y2p*SCALE+YOFF);
    }
  }
  Xang += 0.011;
  Yang += 0.012;
  Zang += 0.013;
  rotateObject();
  facets.sort(sortFacets);
}

function sortFacets(a, b) {
  let tZa = rotated[a[0]-1][2] + rotated[a[1]-1][2] + rotated[a[2]-1][2];
  let tZb = rotated[b[0]-1][2] + rotated[b[1]-1][2] + rotated[b[2]-1][2]; 
  if (tZa < tZb) return -1;
  if (tZa > tZb) return 1;
  return 0;
}

function calcNormal(a1,a2,a3, b1,b2,b3, c1,c2,c3) {
  let Vab = [b1-a1, b2-a2, b3-a3];
  let Vbc = [c1-b1, c2-b2, c3-b3];
  let crossProd = [];
  
  crossProd[0] = Vab[1] * Vbc[2] - Vab[2] * Vbc[1]; 
  crossProd[1] = Vab[2] * Vbc[0] - Vab[0] * Vbc[2]; 
  crossProd[2] = Vab[0] * Vbc[1] - Vab[1] * Vbc[0]; 
  return(crossProd)
}

function rotateObject() {
  let x0, y0, z0, x1, y1, z1, x2, y2, z2, x3, y3, z3;
  
  let sX = sin(Xang);
  let cX = cos(Xang);
  let sY = sin(Yang);
  let cY = cos(Yang);
  let sZ = sin(Zang);
  let cZ = cos(Zang);
  
  for(let i=0; i<vertices.length; ++i) {
    x0 = vertices[i][0];
    y0 = vertices[i][1];
    z0 = vertices[i][2];
    
    // xRotate
    x1 =   1*x0 +  0*y0 +  0*z0;
    y1 =   0*x0 + cX*y0 - sX*z0;
    z1 =   0*x0 + sX*y0 + cX*z0;
    
    // yRotate
    x2 =  cY*x1 + 0*y1 + sY*z1;
    y2 =   0*x1 + 1*y1 +  0*z1;
    z2 = -sY*x1 + 0*y1 + cY*z1;
    
    // zRotate
    x3 =  cZ*x2 - sZ*y2 + 0*z2;
    y3 =  sZ*x2 + cZ*y2 + 0*z2;
    z3 =   0*x2 +  0*y2 + 1*z2;
    
    rotated[i][0] = x3;
    rotated[i][1] = y3;
    rotated[i][2] = z3;
  }

}

function loadObject() {
  let x, y, z;
  let actualMin, actualMax;
  let xMin, xMid, xMax, yMin, yMid, yMax, zMin, zMid, zMax;
  let verCnt = vertexData.length/3;
  let facCnt = facetData.length/3;
  let scaleMin = -0.5;
  let scaleMax =  0.5;
  
  xMin = xMid = xMax = yMin = yMid = yMax = zMin = zMid = zMax = 0;

  for(let i=0; i<verCnt; ++i) {
    x = vertexData[i*3+0];
    y = vertexData[i*3+1];
    z = vertexData[i*3+2];
    if (x < xMin) { xMin = x; }
    if (x > xMax) { xMax = x; }
    if (y < yMin) { yMin = y; }
    if (y > yMax) { yMax = y; }
    if (z < zMin) { zMin = z; }
    if (z > zMax) { zMax = z; }
  }
  xMid = (xMax+xMin)/2;
  yMid = (yMax+yMin)/2;
  zMid = (zMax+zMin)/2;
  actualMin = min(xMin, yMin, zMin);
  actualMax = min(xMax, yMax, zMax);

  // CENTER and SCALE
  for(let i=0; i<verCnt; ++i) {
    x = vertexData[i*3+0] - xMid;
    y = vertexData[i*3+1] - yMid;
    z = vertexData[i*3+2] - zMid;
    vertices[i] = [];
    vertices[i][0] = theMap(x, actualMin, actualMax, scaleMin, scaleMax);
    vertices[i][1] = theMap(y, actualMin, actualMax, scaleMin, scaleMax);
    vertices[i][2] = theMap(z, actualMin, actualMax, scaleMin, scaleMax);
    rotated[i] = [];
    rotated[i][0] = theMap(x, actualMin, actualMax, scaleMin, scaleMax);
    rotated[i][1] = theMap(y, actualMin, actualMax, scaleMin, scaleMax);
    rotated[i][2] = theMap(z, actualMin, actualMax, scaleMin, scaleMax);
  }
  
  for(let i=0; i<facCnt; ++i) {
    facets[i] = [];
    facets[i][0] = facetData[i*3+0];
    facets[i][1] = facetData[i*3+1];
    facets[i][2] = facetData[i*3+2];
  }
    
}

function theMap(a, fMin, fMax, tMin, tMax) {
  return (a - fMin) * (tMax - tMin) / (fMax - fMin) + tMin;
}