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

export async function downloadDocx(text: string, baseName: string) {
    const paragraphs = text.split(/\n\s*\n/).map(
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
                children: paragraphs,
            },
        ],

    });

    const blob = await Packer.toBlob(doc);
    triggerDownload(blob, `${baseName}.docx`);
}

export function downloadPdf(text: string, baseName: string) {
    const pdf  = new jsPDF({ unit: "pt", format: "letter" });
    const margin = 72;
    const maxWidth = pdf.internal.pageSize.getWidth() - margin * 2;
    const pageHeight = pdf.internal.pageSize.getHeight();
    const lineHeight = 15;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    let y = margin;
    for (const para of text.split(/\n\s*\n/)) {
        const lines = para
            .split("\n")
            .flatMap((line) => pdf.splitTextToSize(line, maxWidth) as string[]);

        for (const line of lines) {
            if (y + lineHeight > pageHeight - margin) {
                pdf.addPage();
                y = margin;
            }
            pdf.text(line, margin, y);
            y += lineHeight;
        }
        y += lineHeight * 0.6;
    }

    pdf.save(`${baseName}.pdf`);
}