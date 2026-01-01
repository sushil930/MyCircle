import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { CreatePost } from './pages/CreatePost';
import { Profile } from './pages/Profile';
import { Messages } from './pages/Messages';
import { Landing } from './pages/Landing';
import { About } from './pages/About';
import { PostDetails } from './pages/PostDetails';
import { Notifications } from './pages/Notifications';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { ToastProvider } from './contexts/ToastContext';

// Layout wrapper for authenticated pages that require the Navigation bar
const AppLayout: React.FC = () => {
  return (
    <>
      <Navigation />
      <div className="md:ml-64">
        <Outlet />
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <HashRouter>
        <div className="font-sans antialiased text-brand-dark selection:bg-brand-primary selection:text-white">
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Authenticated Application Routes */}
            <Route element={<AppLayout />}>
              <Route path="/feed" element={<Home />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/post/:id" element={<PostDetails />} />
            </Route>
          </Routes>
        </div>
      </HashRouter>
    </ToastProvider>
  );
};

export default App;