import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import LoginModal from './components/LoginModal';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import LearningPaths from './pages/LearningPaths';
import CourseDetail from './pages/CourseDetail';
import PracticeExam from './pages/PracticeExam';
import InterviewPrep from './pages/InterviewPrep';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Portal from './pages/Portal';
import PaymentResult from './pages/PaymentResult';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const openLoginModal = () => setIsLoginOpen(true);

  return (
    <AuthProvider>
      <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Layout openLoginModal={openLoginModal}>
          <Routes>
            <Route path="/" element={<Home openLoginModal={openLoginModal} />} />
            <Route path="/learning-paths" element={<LearningPaths openLoginModal={openLoginModal} />} />
            <Route path="/courses" element={<Navigate to="/learning-paths" replace />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/practice-exam" element={<PracticeExam />} />
            <Route path="/interview-prep" element={<ProtectedRoute> <InterviewPrep /> </ProtectedRoute> }/>
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing openLoginModal={openLoginModal} />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/payment/success" element={<PaymentResult status="success" />} />
            <Route path="/payment/cancel" element={<PaymentResult status="cancel" />} />
            <Route
              path="/portal"
              element={
                <ProtectedRoute>
                  <Portal />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </Layout>
      </Router>
    </AuthProvider>
  );
}