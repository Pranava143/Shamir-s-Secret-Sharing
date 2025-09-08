function parseBigInt(stringValue, base) {
  const bigIntBase = BigInt(base);
  let result = 0n;
  const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
  for (const char of stringValue.toLowerCase()) {
    const digitValue = digits.indexOf(char);
    if (digitValue === -1) throw new Error("Invalid character");
    result = result * bigIntBase + BigInt(digitValue);
  }
  return result;
}

function decodeRoots(json) {
  const { k } = json.keys;
  const indices = Object.keys(json).filter(key => !isNaN(Number(key))).map(Number).sort((a, b) => a - b).slice(0, k);
  return indices.map(idx => {
    const { base, value } = json[String(idx)];
    const x = BigInt(idx);
    const y = parseBigInt(value, parseInt(base));
    return [x, y];
  });
}

function lagrangeC(points) {
  const k = points.length;
  let c = 0n;
  for (let j = 0; j < k; j++) {
    const [xj, yj] = points[j];
    let num = 1n;
    let den = 1n;
    for (let i = 0; i < k; i++) {
      if (i !== j) {
        const [xi] = points[i];
        num *= -xi;
        den *= (xj - xi);
      }
    }
    c += (yj * num) / den;
  }
  return c;
}


const json1 = {
  "keys": { "n": 4, "k": 3 },
  "1": { "base": "10", "value": "4" },
  "2": { "base": "2", "value": "111" },
  "3": { "base": "10", "value": "12" },
  "6": { "base": "4", "value": "213" }
};

const json2 = {
  "keys": { "n": 10, "k": 7 },
  "1": { "base": "6", "value": "13444211440455345511" },
  "2": { "base": "15", "value": "aed7015a346d635" },
  "3": { "base": "15", "value": "6aeeb69631c227c" },
  "4": { "base": "16", "value": "e1b5e05623d881f" },
  "5": { "base": "8", "value": "316034514573652620673" },
  "6": { "base": "3", "value": "2122212201122002221120200210011020220200" },
  "7": { "base": "3", "value": "20120221122211000100210021102001201112121" },
  "8": { "base": "6", "value": "20220554335330240002224253" },
  "9": { "base": "12", "value": "45153788322a1255483" },
  "10": { "base": "7", "value": "1101613130313526312514143" }
};

const points1 = decodeRoots(json1);
console.log(lagrangeC(points1).toString());

const points2 = decodeRoots(json2);
console.log(lagrangeC(points2).toString());
