'use client';

import Head from 'next/head';
import dynamic from 'next/dynamic';
import { BoardProvider } from '../context/BoardContext';
import { BoardData } from '../types';
import TaskChart from './TaskChart';

const Board = dynamic(() => import('./Board'), { ssr: false });
const Header = dynamic(() => import('./Header'), { ssr: false });

export default function ClientBoard({ initialBoardData }: { initialBoardData: BoardData }) {
  return (
    <BoardProvider initialData={initialBoardData}>
      <div className="flex flex-col h-screen bg-white">
        <Head>
          <title>Real-Time Board</title>
          <meta name="description" content="A collaborative task board built with Next.js and Socket.IO" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />
        <div className="w-full max-w-2xl mx-auto mt-4 px-2">
          <TaskChart boardData={initialBoardData} />
        </div>
        <main className="flex-grow overflow-hidden">
          <Board />
        </main>
      </div>
    </BoardProvider>
  );
}
