import { getBoardData } from '../server/db';
import { BoardData } from '../types';
import ClientBoard from '../components/ClientBoard';


export default async function HomePage() {
  const initialBoardData: BoardData = await getBoardData(); 

  return <ClientBoard initialBoardData={initialBoardData} />;
}
