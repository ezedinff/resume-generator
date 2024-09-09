const getPrompt = (aboutMe: string, jobDescription: string, keywords: string) => `
Use \\textbf{keyword} for bold text. Do not use ** for bold text.
    CRITICAL: Before finalizing the resume, double-check that ALL of these keywords are included somewhere in the document: ${keywords}
    If any are missing, find a relevant section to add them, even if it requires creating a new section or new skill category (e.g., "Additional Skills" or "Relevant Coursework").
    CRITICAL: ensure all experiences from personal information are included in the resume nothing should be omitted.
Create a tailored, ATS-friendly resume in LaTeX format based on the following personal information and job description. Follow these specific guidelines:

1. Use this LaTeX template as a base:

\\documentclass[letterpaper,10pt]{article}

% Packages
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage{fontawesome5}
\\usepackage{multicol}
\\usepackage{bookmark}
\\usepackage{lastpage}
\\usepackage{CormorantGaramond}
\\usepackage{charter}
\\usepackage{xcolor}
\\usepackage{tabularx}

% Colors
\\definecolor{primaryColor}{HTML}{9f1239}
\\definecolor{textColor}{HTML}{000000}

% Document settings
\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}
\\urlstyle{same}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.7in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.19in}
\\addtolength{\\topmargin}{-0.7in}
\\addtolength{\\textheight}{1.4in}

% Custom commands for header
\\newcommand{\\headerName}[1]{
 \\textbf{\\Huge\\color{primaryColor} #1}\\\\[0.3em]
}

\\newcommand{\\headerTitle}[1]{
 \\textbf{\\LARGE\\color{primaryColor} #1}\\\\[0.3em]
}

\\newcommand{\\headerContact}[4]{
 \\ifx\\relax#1\\relax\\else\\textcolor{primaryColor}{\\faIcon{phone}} \\href{tel:#1}{#1} \\quad\\fi
 \\textcolor{primaryColor}{\\faIcon{envelope}} \\href{mailto:#2}{#2} \\quad
 \\textcolor{primaryColor}{\\faIcon{linkedin}} \\href{https://#3}{#3} \\quad
 \\textcolor{primaryColor}{\\faIcon{github}} \\href{https://#4}{#4}\\\\[0.3em]
}

\\newcommand{\\headerLocation}[2]{
 \\textcolor{primaryColor}{\\faIcon{map-marker-alt}} #1, #2
}

\\titleformat{\\section}{
 \\vspace{-5pt}
 \\color{primaryColor}
 \\raggedright\\large\\bfseries
}{}{0em}{}[\\color{textColor}\\titlerule]

\\newcommand{\\role}[1]{\\textbf{#1}}
\\newcommand{\\company}[1]{\\textbf{\\textcolor{primaryColor}{#1}}}
\\newcommand{\\school}[1]{\\textbf{\\textcolor{primaryColor}{#1}}\\\\}
\\newcommand{\\daterange}[1]{\\textit{#1}}
\\newcommand{\\location}[1]{\\textcolor{primaryColor}{\\faIcon{map-marker-alt}} #1}

\\newcommand{\\skillcategory}[1]{\\item \\textbf{\\color{textColor}#1:} }

% Custom environment for experience items with reduced vertical spacing
\\newenvironment{experience_list}{
 \\begin{itemize}[leftmargin=*,labelsep=0.5em,itemsep=0.1em,parsep=0.1em]
}{
 \\end{itemize}
}

% Custom environment for skills list
\\newenvironment{skills_list}{
 \\begin{itemize}[leftmargin=*,labelsep=0.5em,itemsep=0.2em,parsep=0.2em]
}{
 \\end{itemize}
}

\\raggedright
\\color{textColor}

\\begin{document}

% Your resume content will go here

\\end{document}

2. Format the header exactly as follows:
  \\headerName{Full Name}
  \\headerTitle{Job Title}
  \\headerContact{phone number}{email}{linkedin}{github}
  \\headerLocation{City}{Country}

  Ensure each of these commands is on a separate line to create a 4-line header.
  If the phone number is not provided, omit it from the \\headerContact command.
  Use "Senior Software Engineer" as the job title if the years of experience exceed 5 years.

3. Use LaTeX to format the rest of the resume, including sections for summary, skills, experience, education, and projects if they exist in Personal Information.
4. List all skills from the Job Description in the appropriate categories. Ensure the resume includes all required and preferred skills from the job description.
  For the Skills section, use the following format:
  \\begin{skills_list}
    \\skillcategory{Frontend Frameworks/Design} React, Vue.js, Angular, ...
    \\skillcategory{Backend Frameworks} Node.js, Django, ...
    \\skillcategory{DevOps/Tools} Docker, Kubernetes, ...
    \\skillcategory{Databases and Cloud Platforms} MySQL, PostgreSQL, AWS, ...
    \\skillcategory{Languages} JavaScript, Python, ...
    \\skillcategory{Other Skills, Methodologies and Tools} Agile, Scrum, ...
    \\skillcategory{Soft Skills} Communication, Problem-solving, ...
  \\end{skills_list}

  List skills as comma-separated values after each category. Each category should be a bullet point with textColor and bold.
  Include all skills from the Job Description in the appropriate categories. Please ensure that the skills are relevant to the job description otherwise do not include them.
  Check the resume you generate includes all required and preferred skills from the job description.

5. Update the Summary section to best fit the job description, highlighting key skills and experiences that match the job requirements. tell 
   how many years of experience the candidate has in the field.

6. For each experience entry, format it as follows:
\noindent\begin{tabularx}{\textwidth}{@{}X r@{}}
  \\role{Job Title} & \\location{Location - Work Type} \\\\
  \\company{Company Name} & \\daterange{Month Year - Month Year} \\\\
  \\end{tabularx}
  \\begin{experience_list}
    \\item Achievement or responsibility
    \\item Another achievement or responsibility
  \\end{experience_list}
  \\vspace{1em}

  Use "Present" for current positions. Always use three-letter abbreviations for months (e.g., Jan, Feb, Mar).
  For the location and work type, use the format "City, State/Country - Work Type" (e.g., "Beirut Governorate, Lebanon - Remote Contract").
  All experience from personal information should be included in the resume nothing should be omitted.
7. For each education entry, format it as follows:
   \\school{University Name}
   \\role{Degree}
   \\vspace{1em}

   Do not include location information or date ranges for education entries.
   Ensure the school name and degree are on separate lines, with the school name first.

8. Ensure each bullet point in the experience section aligns closely with the job description. Bold any skills or keywords mentioned in the bullet points.

9. Use the primary color (#9f1239) only for:
  - Header Name
  - Header Title
  - Section titles
  - Company names and school names
  - Icons
  All other text should be in the default black color.

10. Make all keywords from the job description bold, especially these: ${keywords}. Make sure all keywords included in the resume. Use \\textbf{keyword} for bold text. Do not use ** for bold text.

11. Ensure all content is left-aligned (this is set up in the template with \\raggedright).

12. To write C#, use C\\# in the LaTeX code.

13. Place icons before the text in the contact information and location.

14. Make email, phone, LinkedIn, and GitHub clickable links.

15. Enhance the resume's ATS performance and impact:
    a. Quantify achievements: Include at least 6-8 measurable achievements across different roles in the experience section. Use specific numbers, percentages, or dollar amounts to demonstrate impact. Aim for a mix of different metrics. For example:
       - "Increased website traffic by 150% over 6 months"
       - "Reduced project completion time by 30% through process optimization"
       - "Improved code maintainability by 40% as measured by cyclomatic complexity"
       - "Boosted system efficiency by 50%, resulting in $500,000 annual savings"
       - "Decreased bug rate by 60% through implementation of automated testing"
       - "Grew user base by 200%, from 10,000 to 30,000 active monthly users"
       - "Accelerated deployment frequency from bi-weekly to daily releases"
       - "Achieved 99.99% uptime for critical systems, surpassing SLA requirements"

    b. Use unique action verbs: Start each bullet point in the experience section with a strong, unique action verb. Avoid repeating verbs. Examples include:
       - Spearheaded, Orchestrated, Pioneered, Revolutionized, Streamlined

    c. Incorporate more soft skills: Weave in at least 8-10 relevant soft skills throughout the resume, particularly in the summary and experience sections. Some examples include:
       - Communication, Leadership, Adaptability, Time Management, Creativity, Critical Thinking, Teamwork, Emotional Intelligence, Problem-solving, Collaboration

    d. Emphasize impact: In each experience bullet point, focus on the result or impact of your actions, not just the tasks you performed. Use the format: Action Verb + Task + Result/Impact.

Personal Information:
${aboutMe}

Job Description:
${jobDescription}

Please generate the complete LaTeX code for the resume, ensuring it's optimized for ATS systems and closely matches the job description. Make sure to emphasize expertise in required skills and present a comprehensive skill set that makes the candidate appear as an expert in the field.
`;



export default getPrompt;