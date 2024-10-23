import React from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { TodoList } from './components/TodoList';
import { store } from './store';

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <ConfigProvider>
                <div className="min-h-screen bg-gray-100">
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Todo App
                            </h1>
                        </div>
                    </header>
                    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <TodoList />
                    </main>
                </div>
            </ConfigProvider>
        </Provider>
    );
};

export default App;