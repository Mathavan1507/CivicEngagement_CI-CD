import { Routes, Route } from 'react-router-dom'
 
import Login    from './pages/auth/Login'
import Register from './pages/auth/Register'
 
import AdminLayout       from './Components/AdminLayout'
import ContributorLayout from './Components/ContributorLayout'
import UserLayout        from './Components/UserLayout'
 
import AdminDashboard     from './pages/AdminDashboard'
import ManageUsers        from './pages/ManageUsers'
import ManageContributors from './pages/ManageContributors'
import PolicyCrud         from './pages/PolicyCrud'
import ContributionReview from './pages/ContributionReview'
 
import ContributorDashboard from './pages/contributor/ContributorDashboard'
import Summarization        from './pages/contributor/Summarization'
 
import UserDashboard from './pages/user/UserDashboard'
import AllPolicies   from './pages/user/AllPolicies'
import Compare       from './pages/user/Compare'
 
import RoleRoute from './routes/RoleRoute'
 
function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<Login />} />
      <Route path="/register" element={<Register />} />
 
      {/* Admin */}
      <Route path="/admin" element={<RoleRoute role="ADMIN"><AdminLayout /></RoleRoute>}>
        <Route path="dashboard"    element={<AdminDashboard />} />
        <Route path="users"        element={<ManageUsers />} />
        <Route path="contributors" element={<ManageContributors />} />
        <Route path="policies"     element={<PolicyCrud />} />
        <Route path="review"       element={<ContributionReview />} />
      </Route>
 
      {/* Contributor */}
      <Route path="/contributor" element={<RoleRoute role="CONTRIBUTOR"><ContributorLayout /></RoleRoute>}>
        <Route path="dashboard"     element={<ContributorDashboard />} />
        <Route path="summarization" element={<Summarization />} />
      </Route>
 
      {/* User */}
      <Route element={<RoleRoute role="USER"><UserLayout /></RoleRoute>}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/policies"  element={<AllPolicies />} />
        <Route path="/compare"   element={<Compare />} />
      </Route>
    </Routes>
  )
}
 
export default App
 