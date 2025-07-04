declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: { type: string; quality: number };
    html2canvas?: { 
      scale?: number;
      useCORS?: boolean;
      allowTaint?: boolean;
      logging?: boolean;
      letterRendering?: boolean;
    };
    jsPDF?: { 
      unit: 'pt'|'mm'|'cm'|'in'|'px'|'em'|'ex'; 
      format: 'a0'|'a1'|'a2'|'a3'|'a4'|'a5'|'a6'|'a7'|'a8'|'a9'|'a10'|'b0'|'b1'|'b2'|'b3'|'b4'|'b5'|'b6'|'b7'|'b8'|'b9'|'b10'|'c0'|'c1'|'c2'|'c3'|'c4'|'c5'|'c6'|'c7'|'c8'|'c9'|'c10'|'dl'|'letter'|'government-letter'|'legal'|'junior-legal'|'ledger'|'tabloid'|'credit-card'|number[];
      orientation: 'portrait'|'landscape';
    };
    pagebreak?: { 
      mode?: 'avoid-all'|'css'|'legacy';
      before?: string;
      after?: string;
      avoid?: string;
    };
  }

  interface Html2Pdf {
    set(options: Html2PdfOptions): Html2Pdf;
    from(element: HTMLElement | string): Html2Pdf;
    toPdf(): Html2Pdf;
    toCanvas(): Html2Pdf;
    toImg(): Html2Pdf;
    save(filename?: string): Promise<void>;
    output(type?: 'pdf'|'canvas'|'img'|'blob'): Promise<any>;
    outputPdf(type?: 'save'|'datauristring'|'dataurlstring'|'dataurlnewwindow'|'blob'): Promise<any>;
  }

  const html2pdf: () => Html2Pdf;
  export = html2pdf;
}