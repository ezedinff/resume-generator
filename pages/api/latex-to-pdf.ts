import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { latex } = req.body;

      if (!latex) {
        return res.status(400).json({ error: 'LaTeX content is required' });
      }

      // We'll use a third-party service to convert LaTeX to PDF
      // For this example, we'll use the LaTeX.Online service
      const response = await fetch('https://latexonline.cc/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: latex,
          force: '1',
        }),
      });

      if (!response.ok) {
        // If the compilation fails, suggest using Overleaf
        return res.status(500).json({ 
          error: 'LaTeX compilation failed',
          message: 'The LaTeX compilation service encountered an error. For better results, try using Overleaf which has more advanced LaTeX support.',
          useOverleaf: true
        });
      }

      // Get the PDF as a buffer
      const pdfBuffer = await response.arrayBuffer();

      // Set the appropriate headers for a PDF file
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
      
      // Send the PDF data
      res.send(Buffer.from(pdfBuffer));
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ 
        error: 'An error occurred while generating the PDF',
        message: 'For a more reliable experience, consider using Overleaf which provides a full LaTeX editing environment.',
        useOverleaf: true
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 