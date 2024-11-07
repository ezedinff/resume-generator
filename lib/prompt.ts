const getPrompt = (aboutMe: string, jobDescription: string, keywords: string) => `
Use \\textbf{keyword} for bold text. Do not use ** for bold text.
    CRITICAL: Before finalizing the resume, double-check that ALL of these keywords are included somewhere in the document: ${keywords}
    If any are missing, find a relevant section to add them ONLY if you have substantial experience (>11 months) with that technology or skill.
    CRITICAL: Only include experiences that are 11 months or longer in duration. Skip any roles or projects that are shorter.
    CRITICAL: Only include technologies and skills where you have significant hands-on experience (>11 months). Do not list technologies you've only briefly worked with.

Create a tailored, ATS-friendly resume in LaTeX format based on the following personal information and job description. Follow these specific guidelines:

[Previous LaTeX template and package setup remains the same...]

2. Format the header exactly as follows:
  \\headerName{Full Name}
  \\headerTitle{Job Title}
  \\headerContact{phone number}{email}{linkedin}{github}
  \\headerLocation{City}{Country}

  Ensure each of these commands is on a separate line to create a 4-line header.
  If the phone number is not provided, omit it from the \\headerContact command.
  Use "Senior Software Engineer" as the job title if the years of experience exceed 5 years.

3. Use LaTeX to format the rest of the resume, including sections for summary, skills, experience, and education if they exist in Personal Information.

4. For the Skills section:
   - ONLY include skills that match the job requirements AND where you have >11 months of experience
   - Prioritize skills that are directly mentioned in the job description
   - Group skills by relevance to the role, with most relevant categories first
   - Within each category, list most relevant/experienced skills first
   
  Use this format:
  \\begin{skills_list}
    \\skillcategory{Primary Stack} [List core technologies required by the job that you're expert in]
    \\skillcategory{Supporting Technologies} [List secondary tools/frameworks you've used extensively]
    \\skillcategory{Infrastructure & DevOps} [If relevant to the role]
    \\skillcategory{Domain Expertise} [Industry-specific skills and knowledge]
    \\skillcategory{Core Competencies} [Relevant soft skills with demonstrated experience]
  \\end{skills_list}

5. Summary section guidelines:
   - Start with years of focused experience in the primary technology stack
   - Highlight 2-3 most relevant technical strengths for this specific role
   - Mention domain expertise if relevant
   - Keep to 3-4 sentences maximum
   - Focus on expertise directly related to the job requirements

6. Experience section guidelines:
   - Only include roles lasting 11 months or longer
   - Prioritize experiences using technologies mentioned in the job description
   - For each role, lead with achievements using the primary tech stack
   - Focus bullet points on technologies and skills required by the job
   - Remove experience with technologies not relevant to this role
   - Use this format:

\\noindent\\begin{tabularx}{\\textwidth}{@{}X r@{}}
  \\role{Job Title} & \\location{Location - Work Type} \\\\
  \\company{Company Name} & \\daterange{Month Year - Month Year} \\\\
  \\end{tabularx}
  \\begin{experience_list}
    \\item Achievement using primary tech stack
    \\item Another relevant achievement
  \\end{experience_list}
  \\vspace{1em}

[Previous education format remains the same...]

7. Quantify achievements focusing on relevant tech:
   - Include metrics that demonstrate expertise in required technologies
   - Example: "Improved API response time by 65% through \\textbf{Redis} caching implementation"
   - Example: "Reduced build times by 40% using \\textbf{Docker} containerization"
   - Example: "Achieved 99.9% uptime for \\textbf{Node.js} microservices"

8. Action verbs should emphasize technical leadership:
   - Architected, Optimized, Engineered, Implemented, Scaled
   - Focus on verbs that show deep technical expertise

9. Technical soft skills to emphasize:
   - Technical mentorship
   - System design
   - Architecture planning
   - Code review leadership
   - Technical documentation
   - Performance optimization

[Previous formatting guidelines remain the same...]

Personal Information:
${aboutMe}

Job Description:
${jobDescription}

Please generate a focused, technically credible resume that emphasizes deep expertise in the required technology stack. Only include technologies and experiences where you have substantial (>11 months) hands-on experience. The goal is to present you as an expert in the specific technologies required for this role, rather than as a generalist.
`;

export default getPrompt;
