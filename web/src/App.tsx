import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Playbook from './pages/Playbook'
import Modules from './pages/Modules'
import ModuleDetail from './pages/ModuleDetail'
import FileViewer from './pages/FileViewer'
import IdeaScorer from './pages/IdeaScorer'
import Roadmap from './pages/Roadmap'
import Commandments from './pages/Commandments'
import NotFound from './pages/NotFound'
import IdeaAnalyzerLanding from './pages/idea-analyzer/IdeaAnalyzerLanding'
import IdeaAnalyzerWizard from './pages/idea-analyzer/IdeaAnalyzerWizard'
import IdeaAnalyzerResult from './pages/idea-analyzer/IdeaAnalyzerResult'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/playbook" element={<Playbook />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/modules/:slug" element={<ModuleDetail />} />
        <Route path="/file/*" element={<FileViewer />} />
        <Route path="/tools/idea-scorer" element={<IdeaScorer />} />
        <Route path="/tools/idea-analyzer" element={<IdeaAnalyzerLanding />} />
        <Route path="/tools/idea-analyzer/new" element={<IdeaAnalyzerWizard />} />
        <Route path="/tools/idea-analyzer/result/:id" element={<IdeaAnalyzerResult />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/commandments" element={<Commandments />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
