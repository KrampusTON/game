'use client';

import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import Game from '@/components/Game';
import CatchingGame from '@/components/CatchingGame';
import Mine from '@/components/Mine';
import Friends from '@/components/Friends';
import Earn from '@/components/Earn';
import Airdrop from '@/components/Airdrop';
import Navigation from '@/components/Navigation';
import LoadingScreen from '@/components/Loading';
import { AutoIncrement } from '@/components/AutoIncrement';
import { PointSynchronizer } from '@/components/PointSynchronizer';
import Settings from '@/components/Settings';
import Boost from '@/components/Boost';

interface Task {
  id: string; // Alebo `number` v závislosti od údajov
  name: string;
}

function ClickerPage() {
  const [currentView, setCurrentViewState] = useState<string>('loading');
  const [isInitialized, setIsInitialized] = useState(false);

  const setCurrentView = (newView: string) => {
    console.log('Changing view to:', newView);
    setCurrentViewState(newView);
  };

  const renderCurrentView = useCallback(() => {
    if (!isInitialized) {
      return (
        <LoadingScreen
          setIsInitialized={setIsInitialized}
          setCurrentView={setCurrentView}
        />
      );
    }

    switch (currentView) {
      case 'game':
        return <Game currentView={currentView} setCurrentView={setCurrentView} />;
      case 'catch':
        return <CatchingGame currentView={currentView} setCurrentView={setCurrentView} />;
      case 'boost':
        return <Boost currentView={currentView} setCurrentView={setCurrentView} />;
      case 'settings':
        return <Settings setCurrentView={setCurrentView} />;
      case 'mine':
        return <Mine setCurrentView={setCurrentView} />;
      case 'friends':
        return <Friends />;
      case 'earn':
        return <Earn />;
      case 'airdrop':
        return <Airdrop />;
      default:
        return <Game currentView={currentView} setCurrentView={setCurrentView} />;
    }
  }, [currentView, isInitialized]);

  console.log('ClickerPage rendering. Current state:', { currentView, isInitialized });

  return (
    <div className="bg-black min-h-screen text-white">
      {isInitialized && (
        <>
          <AutoIncrement />
          <PointSynchronizer />
        </>
      )}
      {renderCurrentView()}
      {isInitialized && currentView !== 'loading' && (
        <Navigation
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      )}
    </div>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

function AdminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div>
      <h1>Tasks</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>{task.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ClickerPageWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <ClickerPage />
      <AdminTasksPage />
    </ErrorBoundary>
  );
}
