import { Route, Routes } from 'react-router'
import './App.css'
import Home from './Home'
import LocalGame from './pages/LocalGame'
import GameJson from './pages/LocalGameJson'

export default function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game/:id" element={<LocalGame />} />
      <Route path="/game/:id/json" element={<GameJson />} />
    </Routes>
    </>
  )
};
