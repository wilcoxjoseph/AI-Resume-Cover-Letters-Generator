import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <section className="space-y-6">
            <span className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-300">
              AI Resume & Cover Letter Generator
            </span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Turn your experience into polished application materials.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              Create tailored resumes and cover letters in minutes with a focused,
              AI-assisted workflow built for job seekers.
            </p>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => navigate("/document")}
                className="rounded-full bg-cyan-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-400">
                Generate my documents
              </button>
              <button className="rounded-full border border-slate-700 px-5 py-3 font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-900">
                See example output
              </button>
            </div>
            <ul className="grid gap-4 pt-4 sm:grid-cols-3">
              <li className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-sm font-semibold text-white">Tailored summaries</p>
                <p className="mt-1 text-sm text-slate-400">Highlight the experience that matters for each role.</p>
              </li>
              <li className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-sm font-semibold text-white">Cover letter drafts</p>
                <p className="mt-1 text-sm text-slate-400">Generate polished introductions that fit the target company.</p>
              </li>
              <li className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-sm font-semibold text-white">Fast iteration</p>
                <p className="mt-1 text-sm text-slate-400">Refine tone, structure, and keywords in seconds.</p>
              </li>
            </ul>
          </section>

          <aside className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/20">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Preview
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Ready-to-use application content
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Paste your background, choose the role you want, and generate a resume summary,
              achievement bullets, and a cover letter draft with a single workflow.
            </p>
            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <p className="text-sm font-medium text-slate-200">Resume summary</p>
                <p className="mt-2 text-sm text-slate-400">
                  Product-focused developer with experience shipping reliable web features.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <p className="text-sm font-medium text-slate-200">Cover letter opening</p>
                <p className="mt-2 text-sm text-slate-400">
                  I'm excited to apply for this role because your team values thoughtful design and fast execution.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
