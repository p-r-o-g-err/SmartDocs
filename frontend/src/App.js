import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import DocumentTypes from './components/DocumentTypes';
import DocumentForm from './components/DocumentForm';
import DocumentPreview from './components/DocumentPreview';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/document-types" element={<DocumentTypes />} />
        <Route path="/document-form/:type" element={<DocumentForm />} />
        <Route path="/preview" element={<DocumentPreview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;