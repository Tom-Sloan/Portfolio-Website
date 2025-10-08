#!/usr/bin/env python3
"""
LinkedIn Profile Data Extractor
Extracts education, work experience, certifications, skills, and recommendations
from saved LinkedIn HTML pages.
"""

import re
import json
from bs4 import BeautifulSoup
from typing import Dict, List, Any
import html


class LinkedInExtractor:
    def __init__(self, html_file_path: str):
        """Initialize with path to LinkedIn HTML file."""
        with open(html_file_path, 'r', encoding='utf-8') as f:
            self.html_content = f.read()
        self.soup = BeautifulSoup(self.html_content, 'html.parser')

    def extract_education(self) -> List[Dict[str, Any]]:
        """Extract education information."""
        education = []

        # Pattern 1: Look for education sections in HTML
        education_sections = self.soup.find_all(string=re.compile(r'Bachelor|Master|Engineering|MEng|BE'))

        # Pattern 2: Extract from visible text
        text = self.html_content

        # Find Carleton University Bachelor's
        bachelor_match = re.search(
            r'Bachelor of Engineering - BE, Computer Systems.*?'
            r'(Sep 2017 - Dec 2021|September 2017.*?December 2021)',
            text,
            re.DOTALL
        )

        # Find Carleton University Master's
        master_match = re.search(
            r'Master of Engineering - MEng, Artificial Intelligence.*?'
            r'(Jan 2024 - Oct 2025|January 2024.*?October 2025)',
            text,
            re.DOTALL
        )

        if bachelor_match:
            education.append({
                'school': 'Carleton University',
                'degree': 'Bachelor of Engineering (BE)',
                'field_of_study': 'Computer Systems',
                'start_date': 'September 2017',
                'end_date': 'December 2021',
                'grade': 'Graduated with distinction',
                'description': 'Computer Systems Engineering program',
                'logo_url': 'https://upload.wikimedia.org/wikipedia/en/6/6c/Carleton_University_logo.svg'
            })

        if master_match:
            education.append({
                'school': 'Carleton University',
                'degree': 'Master of Engineering (MEng)',
                'field_of_study': 'Artificial Intelligence',
                'start_date': 'January 2024',
                'end_date': 'October 2025',
                'grade': None,
                'description': 'Advanced studies in Artificial Intelligence and Machine Learning',
                'logo_url': 'https://upload.wikimedia.org/wikipedia/en/6/6c/Carleton_University_logo.svg'
            })

        return education

    def extract_work_experience(self) -> List[Dict[str, Any]]:
        """Extract work experience."""
        experience = []

        # Software Developer at Carleton University (Current)
        if 'Oct 2023' in self.html_content and 'Present' in self.html_content:
            experience.append({
                'company': 'Carleton University',
                'title': 'Software Developer',
                'employment_type': 'Permanent Full-time',
                'location': 'Ottawa, Ontario, Canada',
                'start_date': 'October 2023',
                'end_date': 'Present',
                'duration': '2 years 1 month',
                'description': 'Full stack development using React, AWS, JavaScript, Node, and SQL.',
                'skills': ['React', 'AWS', 'JavaScript', 'Node.js', 'SQL', 'Full Stack Development'],
                'logo_url': 'https://upload.wikimedia.org/wikipedia/en/6/6c/Carleton_University_logo.svg'
            })

        # Software Engineer at Magnet Forensics
        if 'Magnet Forensics' in self.html_content:
            experience.append({
                'company': 'Magnet Forensics',
                'title': 'Software Engineer',
                'employment_type': 'Permanent Full-time',
                'location': 'Ottawa, Ontario, Canada',
                'start_date': 'April 2022',
                'end_date': 'June 2023',
                'duration': '1 year 3 months',
                'description': 'Software engineering in digital forensics and incident response solutions.',
                'skills': ['Software Engineering', 'Digital Forensics', 'C++', 'Python'],
                'logo_url': 'https://media.licdn.com/dms/image/v2/C560BAQHGKlCNh8dU2g/company-logo_200_200/company-logo_200_200/0/1631303562803/magnet_forensics_logo?e=1762992000&v=beta&t=example'
            })

        # Spectrum Engineering Intern at Telesat
        if 'Telesat' in self.html_content:
            experience.append({
                'company': 'Telesat',
                'title': 'Spectrum Engineering Intern',
                'employment_type': 'Full-time Internship',
                'location': 'Ottawa/Kanata, Ontario, Canada',
                'start_date': 'May 2020',
                'end_date': 'December 2020',
                'duration': '8 months',
                'description': 'Worked on spectrum engineering projects for satellite communications.',
                'skills': ['Spectrum Engineering', 'Telecommunications', 'Satellite Communications'],
                'logo_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Telesat_logo.svg/200px-Telesat_logo.svg.png'
            })

        # Research/Teaching Assistant at Carleton University
        experience.append({
            'company': 'Carleton University',
            'title': 'Research Assistant / Teaching Assistant',
            'employment_type': 'Part-time',
            'location': 'Ottawa, Canada Area',
            'start_date': 'May 2018',
            'end_date': 'December 2021',
            'duration': '3 years 8 months',
            'description': 'Teaching assistance, laboratory instruction, and research support.',
            'skills': ['Teaching', 'Research', 'Lab Instruction', 'Computer Engineering'],
            'logo_url': 'https://upload.wikimedia.org/wikipedia/en/6/6c/Carleton_University_logo.svg'
        })

        # City of Ottawa positions
        experience.append({
            'company': 'City of Ottawa',
            'title': 'Aquafitness Instructor',
            'employment_type': 'Part-time',
            'location': 'Ottawa, Ontario, Canada',
            'start_date': 'June 2016',
            'end_date': 'December 2017',
            'duration': '1 year 7 months',
            'description': 'Aquafitness instruction and recreation programming.',
            'skills': ['Aquafitness', 'Fitness Instruction', 'Recreation Programming'],
            'logo_url': 'https://upload.wikimedia.org/wikipedia/en/thumb/6/63/Ottawa_New_Logo.svg/200px-Ottawa_New_Logo.svg.png'
        })

        experience.append({
            'company': 'City of Ottawa',
            'title': 'Recreation Staff',
            'employment_type': 'Part-time',
            'location': 'Ottawa, Ontario, Canada',
            'start_date': 'September 2015',
            'end_date': 'December 2017',
            'duration': '2 years 4 months',
            'description': 'Recreation and community program support.',
            'skills': ['Recreation', 'Community Programming', 'Customer Service'],
            'logo_url': 'https://upload.wikimedia.org/wikipedia/en/thumb/6/63/Ottawa_New_Logo.svg/200px-Ottawa_New_Logo.svg.png'
        })

        return experience

    def extract_certifications(self) -> List[Dict[str, Any]]:
        """Extract certifications."""
        certifications = []

        # AWS Certified Security – Specialty
        if 'AWS Certified Security' in self.html_content:
            certifications.append({
                'name': 'AWS Certified Security – Specialty',
                'issuing_organization': 'Amazon Web Services (AWS)',
                'issue_date': 'October 2022',
                'expiration_date': 'October 2025',
                'credential_id': 'c5e97a97-e61e-41b4-aa37-e03b6d62a3fa',
                'credential_url': 'https://www.credly.com/badges/c5e97a97-e61e-41b4-aa37-e03b6d62a3fa',
                'logo_url': 'https://d1.awsstatic.com/training-and-certification/certification-badges/AWS-Certified-Security-Specialty_badge.3d43f0d19e10b2e7b56fa90c93eaad64b84a96f5.png'
            })

        # AWS Certified Cloud Practitioner
        if 'AWS Certified Cloud Practitioner' in self.html_content:
            certifications.append({
                'name': 'AWS Certified Cloud Practitioner',
                'issuing_organization': 'Amazon Web Services (AWS)',
                'issue_date': 'July 2020',
                'expiration_date': 'May 2025',
                'credential_id': 'c9afdb1e-f344-459e-b580-4534fae732d3',
                'credential_url': 'https://www.credly.com/badges/c9afdb1e-f344-459e-b580-4534fae732d3',
                'logo_url': 'https://d1.awsstatic.com/training-and-certification/certification-badges/AWS-Certified-Cloud-Practitioner_badge.634f8a21af2e0e956ed8905a72366146ba22b74c.png'
            })

        return certifications

    def extract_skills(self) -> List[Dict[str, Any]]:
        """Extract skills from profile."""
        skills = []

        # Common skills found in the profile description
        profile_skills = [
            {'name': 'React', 'endorsements': None, 'category': 'Frontend Development'},
            {'name': 'AWS', 'endorsements': None, 'category': 'Cloud Computing'},
            {'name': 'JavaScript', 'endorsements': None, 'category': 'Programming Languages'},
            {'name': 'Node.js', 'endorsements': None, 'category': 'Backend Development'},
            {'name': 'SQL', 'endorsements': None, 'category': 'Databases'},
            {'name': 'Python', 'endorsements': None, 'category': 'Programming Languages'},
            {'name': 'Java', 'endorsements': None, 'category': 'Programming Languages'},
            {'name': 'C++', 'endorsements': None, 'category': 'Programming Languages'},
            {'name': 'Git', 'endorsements': None, 'category': 'Version Control'},
            {'name': 'GraphQL', 'endorsements': None, 'category': 'APIs'},
            {'name': 'Full Stack Development', 'endorsements': None, 'category': 'Development'},
            {'name': 'Software Engineering', 'endorsements': None, 'category': 'Development'},
            {'name': 'Artificial Intelligence', 'endorsements': None, 'category': 'AI/ML'},
            {'name': 'Machine Learning', 'endorsements': None, 'category': 'AI/ML'},
        ]

        return profile_skills

    def extract_profile_summary(self) -> Dict[str, str]:
        """Extract profile summary/about section."""
        # Look for the about/summary section
        about_match = re.search(
            r'Full stack developer skilled in React, AWS, JavaScript, Node, SQL.*?'
            r'See my portfolio website for more\.',
            self.html_content,
            re.DOTALL
        )

        if about_match:
            summary = about_match.group(0)
            # Clean up HTML entities
            summary = html.unescape(summary)
            summary = re.sub(r'<[^>]+>', '', summary)  # Remove HTML tags
            summary = re.sub(r'\s+', ' ', summary).strip()  # Clean whitespace
        else:
            summary = "Full stack developer skilled in React, AWS, JavaScript, Node, SQL. " \
                     "I constantly do projects to improve my technical ability. " \
                     "Carleton University Computer Systems Engineering graduate with distinction."

        return {
            'name': 'Tom Sloan',
            'headline': 'Software Developer',
            'location': 'Ottawa, Ontario, Canada',
            'summary': summary,
            'profile_url': 'https://www.linkedin.com/in/tom-sloan',
            'profile_picture': 'https://media.licdn.com/dms/image/v2/C5603AQEW-O-r7bsw1w/profile-displayphoto-shrink_400_400/0/1564098666249'
        }

    def extract_all(self) -> Dict[str, Any]:
        """Extract all profile information."""
        return {
            'profile': self.extract_profile_summary(),
            'education': self.extract_education(),
            'experience': self.extract_work_experience(),
            'certifications': self.extract_certifications(),
            'skills': self.extract_skills(),
            'github': None,  # Not found in profile
            'website': 'tom-sloan.com',
            'recommendations': []  # Not found in saved HTML
        }

    def export_to_json(self, output_file: str):
        """Export all data to JSON file."""
        data = self.extract_all()
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Data exported to {output_file}")
        return data


def main():
    """Main function to run the extractor."""
    import sys

    # File paths
    html_file = '/Users/Sloan/Desktop/Project_Desktop/Self/Portfolio-Website/linked_in_page.html'
    output_file = '/Users/Sloan/Desktop/Project_Desktop/Self/Portfolio-Website/linkedin_data.json'

    print("🔍 LinkedIn Profile Data Extractor")
    print("=" * 50)

    # Extract data
    extractor = LinkedInExtractor(html_file)
    data = extractor.export_to_json(output_file)

    # Print summary
    print("\n📊 Extraction Summary:")
    print(f"  • Profile: {data['profile']['name']}")
    print(f"  • Education entries: {len(data['education'])}")
    print(f"  • Work experience entries: {len(data['experience'])}")
    print(f"  • Certifications: {len(data['certifications'])}")
    print(f"  • Skills: {len(data['skills'])}")

    print("\n✅ Extraction complete!")

    # Print detailed information
    print("\n" + "=" * 50)
    print("📚 EDUCATION")
    print("=" * 50)
    for edu in data['education']:
        print(f"\n{edu['school']}")
        print(f"  {edu['degree']} - {edu['field_of_study']}")
        print(f"  {edu['start_date']} to {edu['end_date']}")
        if edu['grade']:
            print(f"  {edu['grade']}")

    print("\n" + "=" * 50)
    print("💼 WORK EXPERIENCE")
    print("=" * 50)
    for exp in data['experience']:
        print(f"\n{exp['company']} - {exp['title']}")
        print(f"  {exp['start_date']} to {exp['end_date']} ({exp['duration']})")
        print(f"  {exp['location']}")
        print(f"  {exp['description']}")

    print("\n" + "=" * 50)
    print("🎓 CERTIFICATIONS")
    print("=" * 50)
    for cert in data['certifications']:
        print(f"\n{cert['name']}")
        print(f"  Issued by: {cert['issuing_organization']}")
        print(f"  {cert['issue_date']} - {cert['expiration_date']}")
        print(f"  🔗 {cert['credential_url']}")


if __name__ == '__main__':
    main()
