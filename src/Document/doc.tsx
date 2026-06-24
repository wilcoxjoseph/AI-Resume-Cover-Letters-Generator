import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Document() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setFiles(Array.from(event.target.files));
  };

const handleGenerate = async () => {
  try {
    setLoading(true);

    const formData = new FormData();
    if (files.length > 0) {
      formData.append("resume", files[0]);
    }
    formData.append("jobTitle", jobTitle);
    formData.append("jobDescription", jobDescription);
    formData.append("additionalInfo", additionalInfo);

    const response = await fetch("http://localhost:3001/generate", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Failed to generate document");
    }

    setResult(data.result);
  } catch (error) {
    console.error(error);
    alert("Failed to generate documents. See console for details.");
  } finally {
    setLoading(false);
  }
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

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Job details</h2>
            <p className="mt-2 text-sm text-slate-400">
              Tell us the job title, description, and any additional details that will help tailor your resume and cover letter.
            </p>

            <div className="mt-6 grid gap-6">
              <label className="grid gap-2 text-sm text-slate-200">
                <span className="font-medium">Job title</span>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(event) => setJobTitle(event.target.value)}
                  placeholder="e.g. Product Manager, Software Engineer"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-200">
                <span className="font-medium">Job description</span>
                <textarea
                  value={jobDescription}
                  onChange={(event) => setJobDescription(event.target.value)}
                  placeholder="Paste the job posting or describe the role here"
                  rows={4}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-200">
                <span className="font-medium">Additional information</span>
                <textarea
                  value={additionalInfo}
                  onChange={(event) => setAdditionalInfo(event.target.value)}
                  placeholder="Share any preferences, accomplishments, or company specifics to include"
                  rows={4}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </label>
            </div>
          </div>

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

          <button onClick={handleGenerate} 
          disabled={loading}
          className="mt-10 rounded-full bg-cyan-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-400 text-md">
            {loading ? "Generating..." : "Generate documents"}
          </button>
          {result && (
            <div className="mt-8 rounded-3xl bg-slate-950/80 p-6">
              <h2 className="text-xl font-semibold text-white">Generated Documents</h2>
              <pre className="mt-4 text-slate-200">{result}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
