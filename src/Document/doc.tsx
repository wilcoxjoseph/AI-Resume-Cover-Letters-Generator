import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Document() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setFiles(Array.from(event.target.files));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-start px-6 py-16 lg:px-8">
        <button
          onClick={() => navigate("/")}
          className="mb-6 rounded-full border border-slate-700 px-5 py-3 font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-900 w-fit"
        >
          ← Back
        </button>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-black/20">
          <h1 className="text-4xl font-semibold tracking-tight text-white">Upload your documents</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Upload your resume or cover letter files in PDF or DOCX format so we can extract the information and generate polished application materials.
          </p>

          <label className="mt-10 flex flex-col gap-3 rounded-3xl border border-dashed border-slate-700 bg-slate-950/80 p-8 text-center transition hover:border-cyan-500/70">
            <span className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">Upload files</span>
            <span className="text-lg font-semibold text-white">Drag and drop or browse to select files</span>
            <span className="text-sm text-slate-400">Only .pdf and .docx files are accepted.</span>
            <input
              type="file"
              accept=".pdf,.docx"
              multiple
              onChange={handleFileChange}
              className="mx-auto mt-4 block w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-slate-100 outline-none transition hover:border-cyan-500"
            />
          </label>

          {files.length > 0 ? (
            <div className="mt-8 rounded-3xl bg-slate-950/80 p-6">
              <h2 className="text-xl font-semibold text-white">Selected files</h2>
              <ul className="mt-4 space-y-2 text-slate-200">
                {files.map((file) => (
                  <li key={file.name} className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span>{file.name}</span>
                      <span className="text-slate-400">{(file.size / 1024).toFixed(1)} KB</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-8 rounded-3xl bg-slate-950/80 p-6 text-slate-400">
              No files selected yet.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
