import sharp from "sharp";

const SAMPLE_SIZE: number = 32;

function initSQRT(N: number): number[] {
  const c: number[] = new Array(N);
  for (let i: number = 1; i < N; i++) {
    c[i] = 1;
  }
  c[0] = 1 / Math.sqrt(2.0);
  return c;
}

const SQRT: number[] = initSQRT(SAMPLE_SIZE);

function initCOS(N: number): number[][] {
  const cosines: number[][] = new Array(N);
  for (let k: number = 0; k < N; k++) {
    cosines[k] = new Array(N);
    for (let n: number = 0; n < N; n++) {
      cosines[k][n] = Math.cos(((2 * k + 1) / (2.0 * N)) * n * Math.PI);
    }
  }
  return cosines;
}

const COS: number[][] = initCOS(SAMPLE_SIZE);

function applyDCT(f: number[][], size: number): number[][] {
  var N: number = size;

  var F: number[][] = new Array(N);
  for (var u: number = 0; u < N; u++) {
    F[u] = new Array(N);
    for (var v: number = 0; v < N; v++) {
      var sum: number = 0;
      for (var i: number = 0; i < N; i++) {
        for (var j: number = 0; j < N; j++) {
          sum += COS[i][u] * COS[j][v] * f[i][j];
        }
      }
      sum *= (SQRT[u] * SQRT[v]) / 4;
      F[u][v] = sum;
    }
  }
  return F;
}

const LOW_SIZE: number = 16;

export async function phash(
  image: string | Buffer,
  options?: sharp.SharpOptions
): Promise<string> {
  const data: Buffer = await sharp(image, options)
    .greyscale()
    .resize(SAMPLE_SIZE, SAMPLE_SIZE, { fit: "fill" })
    .rotate()
    .raw()
    .toBuffer();
  // copy signal
  const s: number[][] = new Array(SAMPLE_SIZE);
  for (let x: number = 0; x < SAMPLE_SIZE; x++) {
    s[x] = new Array(SAMPLE_SIZE);
    for (let y: number = 0; y < SAMPLE_SIZE; y++) {
      s[x][y] = data[SAMPLE_SIZE * y + x];
    }
  }

  // apply 2D DCT II
  const dct: number[][] = applyDCT(s, SAMPLE_SIZE);

  // get AVG on high frequencies
  let totalSum: number = 0;
  for (let x: number = 0; x < LOW_SIZE; x++) {
    for (let y: number = 0; y < LOW_SIZE; y++) {
      totalSum += dct[x + 1][y + 1];
    }
  }

  const avg: number = totalSum / (LOW_SIZE * LOW_SIZE);

  // compute hash
  let fingerprint: string = "";

  for (let x: number = 0; x < LOW_SIZE; x++) {
    for (let y: number = 0; y < LOW_SIZE; y++) {
      fingerprint += dct[x + 1][y + 1] > avg ? "1" : "0";
    }
  }

  return fingerprint;
}
