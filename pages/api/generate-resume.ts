// pages/api/generate-resume.ts
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from "openai";
import { createClient } from '@supabase/supabase-js';
import getPrompt from '@/lib/prompt';
import aboutme from '@/lib/aboutme';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getKeywords(jobDescription: string, initialKeywords: string): Promise<string> {
    const allKeywords = new Set(initialKeywords.split(',').map(k => k.trim()));
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a professional resume writer with expertise in LaTeX and ATS optimization." },
            { role: "user", content: `Extract key skills and technologies from this job description. Return them as a comma-separated list:\n\n${jobDescription}` }
        ],
        temperature: 0.2,
    });
    
    const response = completion.choices[0].message.content || '';
    if (!response) {
        console.error('No response from OpenAI');
        return Array.from(allKeywords).join(', ');
    }

    return [...Array.from(allKeywords), ...response.split(',').map(k => k.trim())].join(', ');
}

async function generateResume(aboutMe: string, jobDescription: string): Promise<string> {
    try {
        const keywords = await getKeywords(jobDescription, '');
        const prompt = getPrompt(aboutMe, jobDescription, keywords);
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-2024-05-13',
            messages: [
                { role: "system", content: "You are a professional resume writer with expertise in LaTeX and ATS optimization." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
        });

        return completion.choices[0].message.content || '';
    } catch (error) {
        console.error('Error in generateResume:', error);
        return '';
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { jobDescription } = req.body;
      const aboutMe = aboutme;

      let resumeLatex = await generateResume(aboutMe, jobDescription);
      if (!resumeLatex) {
        return res.status(500).json({ error: 'No resume generated' });
      }

      // Extract the LaTeX content from between the backticks
      const latexMatch = resumeLatex.match(/```latex\n([\s\S]+?)\n```/);
      if (latexMatch && latexMatch[1]) {
        resumeLatex = latexMatch[1].trim();
      } else {
        return res.status(500).json({ error: 'Could not extract LaTeX content from the generated resume' });
      }

      // Store the LaTeX content in Supabase
      const { data, error } = await supabase
        .storage
        .from('resumes')
        .upload(`resume_${Date.now()}.tex`, resumeLatex, {
          contentType: 'application/x-tex'
        });

      if (error) {
        throw error;
      }

      // Get the public URL of the stored file
      const { data: publicUrlData } = supabase
        .storage
        .from('resumes')
        .getPublicUrl(data.path);

      const publicUrl = publicUrlData.publicUrl;

      res.status(200).json({ resumeUrl: publicUrl });
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ error: 'An error occurred while generating the resume' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}