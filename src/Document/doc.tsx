import { useNavigate } from "react-router-dom";

export default function Document() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-start px-6 py-16 lg:px-8">
        <button 
          onClick={() => navigate("/")}
          className="mb-6 rounded-full border border-slate-700 px-5 py-3 font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-900 w-fit">
          ← Back
        </button>
        <div className="document">
          <h1 className="text-4xl font-semibold tracking-tight">Document Title</h1>
          <p className="mt-4 text-lg text-slate-300">This is a simple document.</p>
        </div>
      </main>
    </div>
  );
}