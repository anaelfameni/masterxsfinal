import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import NowDashboard from './pages/NowDashboard'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Tasks from './pages/Tasks'
import Objectives from './pages/Objectives'
import Decisions from './pages/Decisions'
import Ideas from './pages/Ideas'
import BusinessGPT from './pages/BusinessGPT'
import Journal from './pages/Journal'
import Notes from './pages/Notes'
import Meetings from './pages/Meetings'
import Habits from './pages/Habits'
import Finances from './pages/Finances'
import Settings from './pages/Settings'
import KnowledgeHub from './pages/KnowledgeHub'
// Pages playbook conservées (Knowledge)
import Playbook from './pages/Playbook'
import Modules from './pages/Modules'
import ModuleDetail from './pages/ModuleDetail'
import FileViewer from './pages/FileViewer'
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
        {/* Pilotage */}
        <Route path="/" element={<NowDashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/objectives" element={<Objectives />} />
        <Route path="/decisions" element={<Decisions />} />
        {/* Exécution */}
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/meetings" element={<Meetings />} />
        {/* Intelligence */}
        <Route path="/businessgpt" element={<BusinessGPT />} />
        <Route path="/ideas" element={<Ideas />} />
        <Route path="/finances" element={<Finances />} />
        {/* Ressources */}
        <Route path="/notes" element={<Notes />} />
        <Route path="/settings" element={<Settings />} />
        {/* Knowledge (playbook hérité) */}
        <Route path="/knowledge" element={<KnowledgeHub />} />
        <Route path="/knowledge/playbook" element={<Playbook />} />
        <Route path="/knowledge/modules" element={<Modules />} />
        <Route path="/knowledge/modules/:slug" element={<ModuleDetail />} />
        <Route path="/knowledge/roadmap" element={<Roadmap />} />
        <Route path="/knowledge/commandments" element={<Commandments />} />
        <Route path="/file/*" element={<FileViewer />} />
        {/* Outils */}
        <Route path="/tools/idea-analyzer" element={<IdeaAnalyzerLanding />} />
        <Route path="/tools/idea-analyzer/new" element={<IdeaAnalyzerWizard />} />
        <Route path="/tools/idea-analyzer/result/:id" element={<IdeaAnalyzerResult />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
