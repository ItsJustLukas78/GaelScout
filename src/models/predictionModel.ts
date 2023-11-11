import * as tf from '@tensorflow/tfjs-node'

// export let predictionModel: any;
//
// if (process.env.NODE_ENV === "production") {
//   predictionModel = await tf.loadLayersModel('file://./src/models/predictionModel/model.json');
// } else {
//   // Ensure the prisma instance is re-used during hot-reloading
//   // @ts-ignore
//   if (!global.predictionModel) {
//     // @ts-ignore
//     global.predictionModel = await tf.loadLayersModel('file://./src/models/predictionModel/model.json');
//   }
//
//   // @ts-ignore
//   predictionModel = global.predictionModel
// }

export const predictMatch = async (
  red_opr: number,
  red_dpr: number,
  red_ccwm: number,
  red_openSkill: number,
  blue_opr: number,
  blue_dpr: number,
  blue_ccwm: number,
  blue_openSkill: number,
) => {
  const predictionModel = await tf.loadLayersModel('file://./src/models/predictionModel/model.json');

  const resultTensor: any = predictionModel.predict(tf.tensor2d([red_opr, red_dpr, red_ccwm, red_openSkill, blue_opr, blue_dpr, blue_ccwm, blue_openSkill], [1, 8]));
  const predictedValue = resultTensor.arraySync()[0][0];

  return predictedValue;
}