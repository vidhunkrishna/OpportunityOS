import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { JWT_SECRET } from '../middleware/authMiddleware.js';

const prisma = new PrismaClient();

export async function register(req, res) {
  try {
    const { name, email, password, education, academicYear, branch } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await prisma.student.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.student.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'STUDENT',
        education: education || 'B.Tech Computer Science',
        academicYear: academicYear || 3,
        branch: branch || 'Computer Science',
        skillsJson: JSON.stringify(['JavaScript', 'React', 'Node.js', 'REST APIs']),
        softSkillsJson: JSON.stringify(['Problem Solving', 'Teamwork']),
        projectsJson: JSON.stringify([]),
        experienceJson: JSON.stringify([]),
        interestsJson: JSON.stringify(['Web Development']),
        preferredDomainsJson: JSON.stringify(['Full Stack']),
        careerGoalsJson: JSON.stringify(['Full Stack Developer']),
        preferredLocationsJson: JSON.stringify(['Remote']),
        preferredOppTypesJson: JSON.stringify(['Internship'])
      }
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create user account.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.student.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful.',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to process login.' });
  }
}

export async function getMe(req, res) {
  try {
    const user = req.user;
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ error: 'Failed to fetch user session.' });
  }
}
