import { Document, Packer, Paragraph, TextRun } from "docx";
import { jsPDF } from "jspdf";

function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

export async function downloadPDF(content: string, baseName: string) {
    const paragraphs = text,split(/\n/).map(
        (block) =>
            new Paragraph({
                spacing: { after: 240, line: 276 },
                children: block
                .split("\n")
                .map((line, i) => new TextRun({ text: line, break: i === 0 ? 0 : 1 })),
            })
    );

    const doc = new Document({
        styles: { default: { document: { run: { font: "Calibri", size: 22}}}},
        sections: [
            {
                properties: {
                    page: {
                        size: { width: 12240, height: 15840 },
                        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
                    },
                },
                children: paragraphs
            },
        ],

    });