

import { Card } from "@/components/ui/card";

const Home = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Welcome</h2>
          <p>This is your dashboard with a sidebar implemented using shadcn UI.</p>
        </Card>
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Tasks</h2>
          <p>You have no pending tasks.</p>
        </Card>
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Profile</h2>
          <p>Your profile is complete.</p>
        </Card>
      </div>
    </div>
  )
}
export default Home
