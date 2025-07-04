import { useBoard } from '../context/BoardContext';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '../lib/cn';

const Header = () => {
  const { isConnected } = useBoard();

  return (
    <header className="p-2 sm:p-4 bg-column-bg border-b border-border-color flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
      <h1 className="text-lg sm:text-xl font-bold text-primary-text text-center sm:text-left">Real-Time Collaborative Board</h1>
      <div className="flex items-center space-x-2">
        <span className={cn('text-xs sm:text-sm', isConnected ? 'text-green-400' : 'text-red-400')}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
        {isConnected ? <Wifi className="text-green-400" size={18} /> : <WifiOff className="text-red-400" size={18} />}
      </div>
    </header>
  );
};


export default Header;