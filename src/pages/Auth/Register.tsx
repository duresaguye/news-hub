export default function Register() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-foreground mb-6">Subscribe / Register</h1>
      <form className="space-y-4">
        <input className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground" placeholder="Full name" />
        <input className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground" placeholder="Email" />
        <input type="password" className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground" placeholder="Password" />
        <button className="w-full px-3 py-2 rounded-lg bg-primary text-white">Create Account</button>
      </form>
    </div>
  );
}


