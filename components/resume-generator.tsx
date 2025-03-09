'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useTheme } from "next-themes"
import { Sun, Moon, Twitter, Linkedin, Github, Menu, X, Sparkles, Copy, Check, FileText, Code, ArrowRight } from "lucide-react"
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { toast } from '@/hooks/use-toast'
import 'katex/dist/katex.min.css'

export default function ResumeGenerator() {
  const [jobDescription, setJobDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [resumeLatex, setResumeLatex] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const { theme, setTheme } = useTheme()
  const [animateInput, setAnimateInput] = useState(false)
  const [animateOutput, setAnimateOutput] = useState(false)

  useEffect(() => {
    const words = jobDescription.trim().split(/\s+/)
    setWordCount(words.length)
  }, [jobDescription])

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isCopied])

  useEffect(() => {
    if (jobDescription.trim() !== '') {
      setAnimateInput(true)
      const timer = setTimeout(() => setAnimateInput(false), 500)
      return () => clearTimeout(timer)
    }
  }, [jobDescription])
  
  useEffect(() => {
    if (resumeLatex) {
      setAnimateOutput(true)
      const timer = setTimeout(() => setAnimateOutput(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [resumeLatex])

  const handleGenerate = async () => {
    setIsGenerating(true)
    setProgress(0)
    setResumeLatex('')
    setCurrentStep(2)
    
    // Scroll to progress indicator
    setTimeout(() => {
      const progressElement = document.getElementById('progress-indicator')
      if (progressElement) {
        progressElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 1000)

      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate resume')
      }

      const data = await response.json()
      clearInterval(progressInterval)
      setProgress(100)

      if (data.latex) {
        setResumeLatex(data.latex)
        setCurrentStep(3)
        
        // Scroll to result after a short delay
        setTimeout(() => {
          const resultElement = document.getElementById('result-section')
          if (resultElement) {
            resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 500)
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
        toast({
          title: "Resume Generated!",
          description: "Your LaTeX resume is ready.",
        })
      } else {
        throw new Error('No resume content returned')
      }
    } catch (error) {
      console.error('Error generating resume:', error)
      toast({
        title: "Error",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive",
      })
      setCurrentStep(1)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resumeLatex)
      .then(() => {
        setIsCopied(true)
        toast({
          title: "Copied!",
          description: "LaTeX code copied to clipboard.",
        })
      })
      .catch(err => {
        console.error('Failed to copy: ', err)
        toast({
          title: "Error",
          description: "Failed to copy to clipboard.",
          variant: "destructive",
        })
      })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F8F9FA] to-[#E9ECEF] dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">AI Resume Crafter</span>
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
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 tracking-tight">
          Transform Your Career with AI
        </h1>
        <p className="text-xl text-center mb-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Create a professional, tailored resume in seconds with our AI-powered resume generator.
        </p>
        
        {/* Step indicator */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'} transition-colors duration-300`}>
                <FileText className="h-5 w-5" />
              </div>
              <span className="mt-2 text-sm font-medium">Input</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'} transition-colors duration-300`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'} transition-colors duration-300`}>
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="mt-2 text-sm font-medium">Processing</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'} transition-colors duration-300`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'} transition-colors duration-300`}>
                <Code className="h-5 w-5" />
              </div>
              <span className="mt-2 text-sm font-medium">Result</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
          {!jobDescription.trim() && !resumeLatex && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Ready to Create Your Resume?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Paste a job description to get started. Our AI will analyze it and generate a tailored LaTeX resume for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setJobDescription("Software Engineer with 5+ years of experience in full-stack development. Proficient in React, Node.js, and cloud technologies. Looking for a talented developer to join our team.");
                  }}
                  className="flex items-center justify-center"
                >
                  <span>Use Sample Text</span>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center justify-center">
                      <span>View Example</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-full md:max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl">
                    <DialogHeader>
                      <DialogTitle>Example Resume</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Here&apos;s an example of what your generated resume might look like:
                      </p>
                      <img 
                        src="/example-resume.png" 
                        alt="Example Resume" 
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 filter blur-[2px] transition-all duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/800x1000?text=Example+Resume";
                        }}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
          
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 ${animateInput ? 'ring-2 ring-primary' : ''}`}>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <span className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                  <FileText className="h-4 w-4 text-primary" />
                </span>
                Job Description
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Paste the job description you&apos;re applying for to generate a tailored resume.
              </p>
            </div>
            <Textarea
              placeholder="Paste your job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-64 p-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-300 ease-in-out resize-none"
              aria-label="Job description input"
              aria-describedby="job-description-help"
              id="job-description"
            />
            <div className="flex justify-between items-center mt-3">
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  wordCount === 0 ? 'bg-gray-300 dark:bg-gray-600' : 
                  wordCount < 50 ? 'bg-red-500' : 
                  wordCount < 100 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`} aria-hidden="true"></span>
                <span id="job-description-help">
                  {wordCount === 0 ? 'No text' : 
                   wordCount < 50 ? 'Too short' : 
                   wordCount < 100 ? 'Good length' : 
                   'Excellent detail'}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">
                Word count: {wordCount}
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || jobDescription.trim() === ''}
            className="w-full py-3 text-lg font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-all duration-300 ease-in-out transform hover:translate-y-[-2px] hover:shadow-lg disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            aria-label={isGenerating ? "Generating resume" : "Generate resume"}
            aria-busy={isGenerating}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Generate Resume
                <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </Button>
          
          {isGenerating && (
            <div className="space-y-2" id="progress-indicator" aria-live="polite" role="status">
              <Progress value={progress} className="w-full h-2" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} />
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                {progress < 30 ? "Analyzing job description..." : 
                 progress < 60 ? "Crafting resume content..." : 
                 progress < 90 ? "Formatting LaTeX code..." : 
                 "Finalizing your resume..."}
              </p>
            </div>
          )}
          
          {resumeLatex && (
            <div id="result-section" className={`mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 ${animateOutput ? 'animate-pulse' : ''}`}>
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex">
                  <button 
                    className="px-4 py-3 font-medium text-sm border-b-2 border-primary text-primary"
                  >
                    LaTeX Code
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold flex items-center">
                      <span className="bg-green-100 dark:bg-green-900/30 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </span>
                      Your Resume is Ready!
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                      Copy the LaTeX code below and use it with any LaTeX editor or online service.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={copyToClipboard}
                    className="flex items-center space-x-2 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    aria-label={isCopied ? "Code copied to clipboard" : "Copy code to clipboard"}
                  >
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
                  </Button>
                </div>
                
                <div className="relative">
                  <div className="absolute top-0 right-0 bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-mono rounded-bl-md">
                    LaTeX
                  </div>
                  <pre className="bg-gray-50 dark:bg-gray-900 p-4 pt-8 rounded-lg overflow-auto max-h-[400px] text-sm font-mono border border-gray-200 dark:border-gray-700" tabIndex={0} aria-label="LaTeX code for your resume">
                    <code className="text-gray-800 dark:text-gray-200">{resumeLatex}</code>
                  </pre>
                </div>
                
                <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium flex items-center text-blue-700 dark:text-blue-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    What to do next?
                  </h3>
                  <ul className="mt-2 text-sm text-blue-600 dark:text-blue-200 space-y-1 ml-7 list-disc">
                    <li>Copy this code using the button above</li>
                    <li>Paste it into an online LaTeX editor like <a href="https://www.overleaf.com" target="_blank" rel="noopener noreferrer" className="underline">Overleaf</a></li>
                    <li>Compile the document to generate your PDF resume</li>
                    <li>Download and use your professionally formatted resume</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Dialog >
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-4 right-4 rounded-full w-12 h-12 bg-primary hover:bg-primary/90 text-white shadow-lg transition-transform hover:scale-105"
            aria-label="AI Writing Tips"
          >
            <Sparkles className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full md:w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl">
          <DialogHeader>
            <DialogTitle>AI Writing Tips</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary mr-2 mt-0.5 flex-shrink-0">1</span>
              <span>Use action verbs to describe your achievements.</span>
            </p>
            <p className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary mr-2 mt-0.5 flex-shrink-0">2</span>
              <span>Quantify your accomplishments with numbers and percentages.</span>
            </p>
            <p className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary mr-2 mt-0.5 flex-shrink-0">3</span>
              <span>Tailor your resume to the specific job description.</span>
            </p>
            <p className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary mr-2 mt-0.5 flex-shrink-0">4</span>
              <span>Keep your resume concise and relevant.</span>
            </p>
            <p className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary mr-2 mt-0.5 flex-shrink-0">5</span>
              <span>Use industry-specific keywords to pass ATS scans.</span>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="bg-white dark:bg-gray-900 shadow-md mt-8">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} AI Resume Crafter. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Your data is never stored or shared with third parties.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center space-x-4 mb-4 md:mb-0">
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