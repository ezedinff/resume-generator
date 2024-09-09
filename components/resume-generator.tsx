'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useTheme } from "next-themes"
import { Sun, Moon, Twitter, Linkedin, Github, Menu, X, Sparkles, Download } from "lucide-react"
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { toast } from '@/hooks/use-toast'

export default function ResumeGenerator() {
  const [jobDescription, setJobDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [resumeUrl, setResumeUrl] = useState('')
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const words = jobDescription.trim().split(/\s+/)
    setWordCount(words.length)
  }, [jobDescription])

  const handleGenerate = async () => {
    setIsGenerating(true)
    setProgress(0)
    setResumeUrl('')

    const staticAboutMe = `Experienced Software Engineer with a strong background in developing high-quality software applications, particularly in the automotive industry. Skilled in Java, JavaScript, cloud technologies, and AI. Proven track record of delivering innovative solutions and collaborating effectively with cross-functional teams.`

    try {
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aboutMe: staticAboutMe, jobDescription }),
      })

      console.log('response:', response)

      if (!response.ok) {
        throw new Error('Failed to generate resume')
      }

      const data = await response.json()

      if (data.resumeUrl) {
        setResumeUrl(data.resumeUrl)
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
        toast({
          title: "Resume Generated!",
          description: "Your resume is ready for download.",
        })
      } else {
        throw new Error('No resume URL returned')
      }
    } catch (error) {
      console.error('Error generating resume:', error)
      toast({
        title: "Error",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
      setProgress(100)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F8F9FA] to-[#E9ECEF] dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">AI Resume Crafter</span>
          </div>
          <nav className="hidden md:flex space-x-4">
            <Link href="#" className="hover:text-primary transition-colors">About</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <nav className="md:hidden bg-white dark:bg-gray-900 py-2">
            <Link href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">About</Link>
            <Link href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Privacy</Link>
            <Link href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Terms</Link>
          </nav>
        )}
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 animate-fade-in">
          Transform Your Career with AI-Powered Resumes
        </h1>
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
          <Textarea
            placeholder="Paste your job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full h-64 p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition-all duration-300 ease-in-out resize-none"
            aria-label="Job description input"
          />
          <div className="text-right text-sm text-gray-500">
            Word count: {wordCount}
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || jobDescription.trim() === ''}
            className="w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {isGenerating ? 'Generating...' : 'Generate Resume'}
          </Button>
          {isGenerating && (
            <Progress value={progress} className="w-full h-2" />
          )}
          {resumeUrl && (
            <Button
              onClick={() => window.open(resumeUrl, '_blank')}
              rel="noopener noreferrer"
              className="w-full py-3 text-lg font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <Download className="mr-2 h-5 w-5" /> Download Resume
            </Button>
          )}
        </div>
      </main>

      <Dialog >
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-4 right-4 rounded-full w-12 h-12 bg-primary hover:bg-primary/80 text-white shadow-lg"
            aria-label="AI Writing Tips"
          >
            <Sparkles className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full md:w-96 bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>AI Writing Tips</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>1. Use action verbs to describe your achievements.</p>
            <p>2. Quantify your accomplishments with numbers and percentages.</p>
            <p>3. Tailor your resume to the specific job description.</p>
            <p>4. Keep your resume concise and relevant.</p>
            <p>5. Use industry-specific keywords to pass ATS scans.</p>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="bg-white dark:bg-gray-900 shadow-md mt-8">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <nav className="flex space-x-4 mb-4 md:mb-0">
            <Link href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">About</Link>
            <Link href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Terms of Service</Link>
          </nav>
          <div className="flex space-x-4">
            <a href="#" aria-label="Twitter" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" aria-label="GitHub" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}