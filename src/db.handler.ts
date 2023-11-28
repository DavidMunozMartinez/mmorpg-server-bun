import * as mongoose from 'mongoose';
import { Player } from './schemas/player.schema';

// connect to database
export async function initDBConnections() {
  await mongoose.connect('mongodb://127.0.0.1:27017/players');
  // await mongoose.connect('mongodb://127.0.0.1:27017/general');
  // create new Animal
  const cow = new Player({
    name: 'Cow',
  });
  await cow.save(); // saves to the database
  
  // read all Animals
  const players = await Player.find();
  console.log(players[0])
  
  // disconnect
  await mongoose.disconnect();
}
