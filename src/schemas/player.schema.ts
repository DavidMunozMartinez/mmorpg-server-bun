import * as mongoose from 'mongoose';

const playerSchema = new mongoose.Schema(
  {
    position: { type: [Number /**X */, Number, /**Y */] },
    name: {type: String, required: true},
    health: { type: Number, default: -1 },
  },
  // {
  // // Use these to create model specific methods
  //   methods: {},
  // }
);

export type Player = mongoose.InferSchemaType<typeof playerSchema>;
export const Player = mongoose.model('Player', playerSchema);